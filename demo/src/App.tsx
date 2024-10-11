import { useState } from "react";
import "./App.css";
import Chatbar from "./components/Chatbar/Chatbar.tsx";
import Convo from "./components/Convo/Convo.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import ChatPopUp from "./components/ChatPopup/ChatPopup.tsx";
import Template from "./components/Template/Template.tsx";

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
                setConvo={setConvo}
            >
            </Navbar>
            <Convo convo={convo}></Convo>
            {!convo.messages.length &&
                (
                    <div id="template-container">
                        <Template
                            title="Load Template Conversation"
                            svg={
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                                    <path d="M8 12h.01" />
                                    <path d="M12 12h.01" />
                                    <path d="M16 12h.01" />
                                </svg>
                            }
                            HandleClick={() => {
                                setConvo({
                                    "messages": [
                                        {
                                            "role": "user",
                                            "content": "Hi!",
                                        },
                                        {
                                            "role": "system",
                                            "content":
                                                "I'd be happy to help you provide some information. May I start by asking, how old are you?",
                                        },
                                        {
                                            "role": "user",
                                            "content": "I'm 19.",
                                        },
                                        {
                                            "role": "system",
                                            "content": "What is your gender?",
                                        },
                                        {
                                            "role": "user",
                                            "content": "Male",
                                        },
                                        {
                                            "role": "system",
                                            "content": "How tall are you?",
                                        },
                                        {
                                            "role": "user",
                                            "content": "6 feet",
                                        },
                                        {
                                            "role": "system",
                                            "content":
                                                'So you\'re 6 feet, but could you please clarify if that\'s 6 feet with some inches, or just 6 feet exactly? For example, you could say "6ft,0in" or "72in" or even "183cm" if you prefer centimeters.',
                                        },
                                        {
                                            "role": "user",
                                            "content": "6 feet exactly",
                                        },
                                        {
                                            "role": "system",
                                            "content":
                                                'So that\'s 6ft,0in. How much do you weigh? Please respond with a number followed by either "lbs" or "kg".',
                                        },
                                        {
                                            "role": "user",
                                            "content": "150 lbs",
                                        },
                                        {
                                            "role": "system",
                                            "content":
                                                "I still need to know your physical activity level. On a scale of 1 to 4, how active are you?",
                                        },
                                        {
                                            "role": "user",
                                            "content": "4",
                                        },
                                        {
                                            "role": "system",
                                            "content": "Your weight is normal",
                                        },
                                    ],
                                    "modelsUsed": [
                                        "Llama3",
                                        "Llama3",
                                        "Llama3",
                                        "Llama3",
                                        "Llama3",
                                        "Llama3",
                                        "Weight-Cat",
                                    ],
                                });
                                setInfoGathered(true);
                                document.querySelector(".template")
                                    ?.scrollIntoView({
                                        "behavior": "smooth",
                                        "block": "start",
                                    });
                            }}
                        >
                        </Template>
                    </div>
                )}
            {clearChat && (
                <ChatPopUp setClearChat={setClearChat} setConvo={setConvo}>
                </ChatPopUp>
            )}
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
