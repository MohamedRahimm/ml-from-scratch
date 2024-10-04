import { useState } from "react";
import "./App.css";
import Chatbar from "./components/Chatbar/Chatbar.tsx";
import Convo from "./components/Convo/Convo.tsx";
import Dropdown from "./components/Dropdown/Dropdown.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
export type Page = "Weight Categorizer" | "Sentiment Analysis";
export default function App() {
    const [convo, setConvo] = useState({
        "user": new Array<string>(),
        "model": new Array<string>(),
    });
    const pageNames: Page[] = ["Weight Categorizer", "Sentiment Analysis"];
    const [currentPage, setCurrentPage] = useState(pageNames[0]);

    return (
        <>
            <Navbar></Navbar>
            <Dropdown
                currentPage={currentPage}
                pageNames={pageNames}
                setCurrentPage={setCurrentPage}
            >
            </Dropdown>

            <Convo convo={convo}></Convo>
            <Chatbar
                setConvo={setConvo}
                currentPage={currentPage}
            >
            </Chatbar>
        </>
    );
}
