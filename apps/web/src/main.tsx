import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Footer from "./components/footer";

import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Footer />
    </StrictMode>,
);
