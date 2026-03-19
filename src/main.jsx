// src/main.jsx (NERVA BOOT v0)
// Goal: zero legacy providers, zero "@/..." imports.

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/prana-landscape-icons.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);