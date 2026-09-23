import ReactDOM from "react-dom/client";
import { AppProviders } from "./app/providers";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/fonts.css";
import "./styles/index.css";
import "./styles/btn.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppProviders>
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <App />
    </BrowserRouter>
  </AppProviders>,
);
