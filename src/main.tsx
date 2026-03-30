import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./app/App";
import "../assets/bootstrap/bootstrap.bundle.min.js";
import "../assets/bootstrap/bootstrap.min.css";
import "../assets/bootstrap-icons/bootstrap-icons.min.css";
import "./styles/app.css";
import "./styles/mobile.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
