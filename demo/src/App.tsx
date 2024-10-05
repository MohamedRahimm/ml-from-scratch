import { useState } from "react";
import "./App.css";
import Chatbar from "./components/Chatbar/Chatbar.tsx";
import Convo from "./components/Convo/Convo.tsx";
import Dropdown from "./components/Dropdown/Dropdown.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

export interface Message {
    role: "user" | "system";
    content: string;
}

export interface ChatRequest {
    messages: Message[];
    model: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    stream: boolean;
    stop: string | null;
}

export interface Convo {
    messages: Message[];
}

export type Page = "Weight Categorizer" | "Sentiment Analysis";
export default function App() {
    const [convo, setConvo] = useState<Convo>({
        "messages": new Array<Message>(),
    });
    const pageNames: Page[] = ["Weight Categorizer", "Sentiment Analysis"];
    const [currentPage, setCurrentPage] = useState<Page>(pageNames[0]);
    const [infoGathered, setInfoGathered] = useState<boolean>(false);
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
                convo={convo}
                setConvo={setConvo}
                currentPage={currentPage}
                infoGathered={infoGathered}
                setInfoGathered={setInfoGathered}
            >
            </Chatbar>
        </>
    );
}
