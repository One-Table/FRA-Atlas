import React from "react";
import ReactDOM from "react-dom/client";
import FRAAppLayout from "./FRAAppLayout"; // If your component is FRAAppLayout.tsx
import "leaflet/dist/leaflet.css";
import "./style.css"; // Import your UI styles

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <FRAAppLayout />
  </React.StrictMode>
);
