// server.js (NERVA BOOT v0)
// Goal: single dev process (Express + Vite), minimal routes, no legacy imports.

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

//routes
import nervaRoutes from "./src/api/routes/nervaRoutes.js";

import { startNervaEngine } from "./server/nerva/engine/engineLoop.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5174; // you can change if you prefer 3000/5173

// --- basic middleware
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

// --- health
app.get("/health", (_req, res) => {
  res.json({ ok: true, name: "nerva" });
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, name: "nerva" });
});

app.use("/api/nerva", nervaRoutes);

// --- DEV: Vite middleware (single process)
async function mountViteDevServer() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom"
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    try {
      const url = req.originalUrl;

      // Load the HTML from Vite (index.html at project root)
      let template = await vite.transformIndexHtml(url, `<!doctype html>
<html lang="pt-br">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Nerva</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      next(err);
    }
  });
}

// --- PROD: serve /dist
function mountProdStatic() {
  const distPath = path.join(__dirname, "dist");
  app.use(express.static(distPath));
  app.use("*", (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

const isProd = process.env.NODE_ENV === "production";

(async () => {
  try {
    if (isProd) {
      mountProdStatic();
    } else {
      await mountViteDevServer();
    }

    app.listen(PORT, () => {
      console.log(`[NERVA] server running on http://localhost:${PORT}`);
      console.log(`[NERVA] health: http://localhost:${PORT}/health`);
      console.log(`[NERVA] api health: http://localhost:${PORT}/api/health`);

       startNervaEngine();
    });
  } catch (e) {
    console.error("[NERVA] failed to start:", e);
    process.exit(1);
  }
})();