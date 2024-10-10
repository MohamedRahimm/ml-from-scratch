import { useState } from "react";
import "./App.css";
import Chatbar from "./components/Chatbar/Chatbar.tsx";
import Convo from "./components/Convo/Convo.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import ChatPopUp from "./components/ChatPopup/ChatPopup.tsx";

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

export type modelUsed = "Llama3" | "Weight-Cat" | "";
export interface Conversation {
    messages: Message[];
    modelsUsed: modelUsed[];
}

export type Page = "Weight Categorizer" | "Sentiment Analysis";
export default function App() {
    const [convo, setConvo] = useState<Conversation>({
        "messages": [],
        "modelsUsed": [],
    });
    const pageNames: Page[] = ["Weight Categorizer", "Sentiment Analysis"];
    const [currentPage, setCurrentPage] = useState<Page>(pageNames[0]);
    const [infoGathered, setInfoGathered] = useState<boolean>(false);
    const [clearChat, setClearChat] = useState<boolean>(false);
    return (
        <>
            <Navbar
                currentPage={currentPage}
                pageNames={pageNames}
                setCurrentPage={setCurrentPage}
            >
            </Navbar>
            {clearChat && (
                <ChatPopUp setClearChat={setClearChat} setConvo={setConvo}>
                </ChatPopUp>
            )}
            <Convo convo={convo}></Convo>
            <Chatbar
                convo={convo}
                setConvo={setConvo}
                currentPage={currentPage}
                infoGathered={infoGathered}
                setInfoGathered={setInfoGathered}
                setClearChat={setClearChat}
            >
            </Chatbar>
        </>
    );
}
