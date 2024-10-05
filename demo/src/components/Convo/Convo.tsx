import { Message } from "../../App.tsx";
import Avatar from "../Avatar/Avatar.tsx";
import "./Convo.css";

interface ConvoProps {
  convo: { messages: Message[] };
}

export default function Convo(props: ConvoProps) {
  const { messages } = props.convo;

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
                <div className="system-text">
                  <span>{msg.content}</span>
                </div>
              </>
            )}
        </div>
      ))}
    </div>
  );
}
