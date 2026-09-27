import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { DialedProvider } from "./context/DialedContext.jsx";
import "./styles/index.css?theme=red-v2";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <DialedProvider>
        <App />
      </DialedProvider>
    </BrowserRouter>
  </StrictMode>,
);
