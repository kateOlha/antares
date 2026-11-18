import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./App";
import { initBlockColors } from "./blockColors";
import { initBackdrop } from "./backdrop";
import { initTheme } from "./theme";
import "./styles.css";
import "./theme-light.css";
import "./theme-light-depth.css";

initTheme();
initBackdrop();
initBlockColors();

const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || "/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter basename={basename === "/" ? undefined : basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
