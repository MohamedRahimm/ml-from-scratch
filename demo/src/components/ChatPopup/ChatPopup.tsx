import "./ChatPopup.css";
import { ConversationState } from "../../definitions.ts";
interface ChatPopUpProps {
    setConvoState: React.Dispatch<React.SetStateAction<ConversationState>>;
}
export default function ChatPopUp(props: ChatPopUpProps) {
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
                            props.setConvoState({
                                "messages": [],
                                modelsUsed: [],
                                clearChat: false,
                                infoGathered: false,
                            });

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
                            props.setConvoState((prevState) => ({
                                ...prevState,
                                clearChat: false,
                            }));
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
