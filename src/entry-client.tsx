import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ClientApp } from "./ClientApp";
import "./index.css";

ReactDOM.hydrateRoot(
  document.getElementById("root")!,
  <BrowserRouter>
    <ClientApp />
  </BrowserRouter>
);
