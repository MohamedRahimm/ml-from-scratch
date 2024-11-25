import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes } from "react-router";
import App from "./App.tsx";
import "./index.css";
import Home from "./components/Home/Home.tsx";
import { ConversationState, Page } from "./definitions.ts";


export const pageNames: Page[] = ["Weight Categorizer", "Sentiment Analysis"];
export const urlMapper: Record<Page, string> = {
    "Sentiment Analysis": "/Sentiment-Analysis",
    "Weight Categorizer": "/Weight-Categorizer"
}


createRoot(document.getElementById("root")!).render(
    <HashRouter basename="/ml-from-scratch">
        <StrictMode>
            <Routes>
                <Route index path="/" element={<Home></Home>}></Route>
                {pageNames.map((val, idx) => (
                    <Route key={idx} path={urlMapper[val]} element={<App currentPage={val} ></App>}></Route>
                ))}
            </Routes>
        </StrictMode>
    </HashRouter>
);
