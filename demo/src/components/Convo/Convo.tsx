import { ConversationState } from "../../definitions.ts";
import Avatar from "../Avatar/Avatar.tsx";
import "./Convo.css";
interface ConvoProps {
    convoState: ConversationState;
}

export default function Convo(props: ConvoProps) {
    const messages = props.convoState.messages;
    const modelsUsed = props.convoState.modelsUsed;
    let i = 0;
    return (
        <div id="convo-container">
            {messages.map((msg, index) => (
                <div key={index} className={`${msg.role}-container`}>
                    {msg.role === "user"
                        ? (
                            <>
                                <div className="user-text">
                                    <span>{msg.content}</span>
                                </div>
                                <Avatar type="user" />
                            </>
                        )
                        : (
                            <>
                                <Avatar type="system" />

                                <div>
                                    {modelsUsed[i] && (
                                        <span className="model-used">
                                            {"Model Used: " + modelsUsed[i++]}
                                        </span>
                                    )}
                                    <p className="system-text">{msg.content}</p>
                                </div>
                            </>
                        )}
                </div>
            ))}
        </div>
    );
}
