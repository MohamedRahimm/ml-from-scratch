import "./ChatPopup.css";
import { Conversation } from "../../App.tsx";
interface ChatPopUpProps {
    setClearChat: React.Dispatch<React.SetStateAction<boolean>>;
    setConvo: React.Dispatch<React.SetStateAction<Conversation>>;
}
export default function ChatPopUp(props: ChatPopUpProps) {
    const setConvo = props.setConvo;
    const setClearChat = props.setClearChat;
    return (
        <div id="popup-container">
            <div id="popup">
                <h1>
                    Are you sure you want to clear your chat?
                </h1>
                <div id="popup-btn-container">
                    <button
                        className="popup-btn"
                        id="clear-popup-btn"
                        onClick={() => {
                            setConvo({ "messages": [], modelsUsed: [] });
                            setClearChat(false);
                            (document.querySelector(
                                "#convo-container",
                            )! as HTMLDivElement).style
                                .overflowY = "";
                        }}
                    >
                        Clear Chat
                    </button>
                    <button
                        className="popup-btn"
                        onClick={() => {
                            setClearChat(false);
                            (document.querySelector(
                                "#convo-container",
                            )! as HTMLDivElement).style
                                .overflowY = "";
                            document.querySelector("#chatbar")?.scrollIntoView({
                                "behavior": "smooth",
                                "block": "end",
                            });
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
