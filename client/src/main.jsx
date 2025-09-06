import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import Context from "./components/Context";
import TripContext from "./components/TripContext";

createRoot(document.getElementById("root")).render(
  <Context>
    <TripContext>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TripContext>
  </Context>
);
