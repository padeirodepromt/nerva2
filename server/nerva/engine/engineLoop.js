import { runNervaEngine } from "./routineRunner.js";

export function startNervaEngine() {

  console.log("[NERVA] engine started");

  setInterval(async () => {

    try {
      await runNervaEngine();
    } catch (err) {
      console.error("[NERVA] engine error", err);
    }

  }, 15000);

}