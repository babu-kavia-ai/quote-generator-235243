import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// PUBLIC_INTERFACE
function bootstrap() {
  /** Bootstraps the React application into the DOM. */
  const el = document.getElementById("root");
  if (!el) {
    throw new Error("Root element #root not found");
  }
  createRoot(el).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
