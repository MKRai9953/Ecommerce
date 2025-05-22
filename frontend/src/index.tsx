import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

if (!container) throw new Error("there is no root in the dom to render");

const root = createRoot(container);
root.render(<App />);
