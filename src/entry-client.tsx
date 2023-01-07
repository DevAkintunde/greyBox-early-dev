import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClientBundle } from "./client/ClientBundle";
import "./index.css";

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <ClientBundle />
  </BrowserRouter>
);
