import { useState } from "react";
import "./App.css";
import Chatbar from "./components/Chatbar/Chatbar.tsx";
import Convo from "./components/Convo/Convo.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import ChatPopUp from "./components/ChatPopup/ChatPopup.tsx";
import Templates from "./components/Template/Templates.tsx";
import { ConversationState, Page } from "./definitions.ts";
// import React from "npm:@types/react@^18.3";

export default function App() {
    const [convoState, setConvoState] = useState<ConversationState>({
        "messages": [],
        "modelsUsed": [],
        "infoGathered": false,
        "clearChat": false,
    });
    const pageNames: Page[] = ["Weight Categorizer", "Sentiment Analysis"];
    const [currentPage, setCurrentPage] = useState<Page>(pageNames[0]);

    return (
        <>
            <Navbar
                setConvoState={setConvoState}
                currentPage={currentPage}
                pageNames={pageNames}
                setCurrentPage={setCurrentPage}
            >
            </Navbar>

            <Convo convoState={convoState}></Convo>

            {!convoState.messages.length && (
                <Templates
                    currentPage={currentPage}
                    setConvoState={setConvoState}
                >
                </Templates>
            )}

            {convoState.clearChat && (
                <ChatPopUp setConvoState={setConvoState}></ChatPopUp>
            )}

            <Chatbar
                convoState={convoState}
                setConvoState={setConvoState}
                currentPage={currentPage}
            >
            </Chatbar>
        </>
    );
}
