import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GeneralBookApp } from "./GeneralBookApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GeneralBookApp />
  </StrictMode>,
);
