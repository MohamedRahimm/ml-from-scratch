import Avatar from "../Avatar/Avatar.tsx";
import "./Convo.css";

interface ConvoProps {
  convo: Record<"user" | "model", string[]>;
}

export default function Convo(props: ConvoProps) {
  const { user, model } = props.convo;

  // Interleave user and model messages into a single array
  const interleavedMessages = [];
  const maxLength = Math.max(user.length, model.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < user.length) {
      interleavedMessages.push({ type: "user", message: user[i] });
    }
    if (i < model.length) {
      interleavedMessages.push({ type: "model", message: model[i] });
    }
  }

  return (
    <div id="convo-container">
      {interleavedMessages.map((msg, index) => (
        <div key={index} className={`${msg.type}-container`}>
          {msg.type === "user"
            ? (
              <>
                <div className="user-text">
                  <span>{msg.message}</span>
                </div>
                <Avatar type="user" />
              </>
            )
            : (
              <>
                <Avatar type="model" />
                <div className="model-text">
                  <span>{msg.message}</span>
                </div>
              </>
            )}
        </div>
      ))}
    </div>
  );
}
