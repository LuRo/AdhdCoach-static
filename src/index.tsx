import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import { I18nProvider } from "./lib/i18n";
import "./assets/bootstrap/bootstrap.bundle.min.js";
import "./assets/bootstrap/bootstrap.min.css";
import "./assets/bootstrap-icons/bootstrap-icons.min.css";
import "./assets/custom-css/app.css";
import "./assets/custom-css/mobile.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nProvider>
      <App />
    </I18nProvider>
  </React.StrictMode>
);
