import "./App.css";
import Chatbar from "./components/Chatbar/Chatbar.tsx";
import Convo from "./components/Convo/Convo.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";
import ChatPopUp from "./components/ChatPopup/ChatPopup.tsx";
import Templates from "./components/Template/Templates.tsx";
import { ConversationState, Page } from "./definitions.ts";
import { useState } from "react";
interface AppProps {
    currentPage: Page
}
export default function App({ currentPage }: AppProps) {
    const [convoState, setConvoState] = useState<ConversationState>({
        "messages": [],
        "modelsUsed": [],
        "infoGathered": false,
        "clearChat": false,
    });
    return (
        <>
            <Navbar
                setConvoState={setConvoState}
                currentPage={currentPage}                 >
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
