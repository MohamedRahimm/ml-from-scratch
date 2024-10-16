import { useRef } from "react";
import "./Chatbar.css";
import inferModel from "../Models/inferModel.ts";
import { ConversationState, Page } from "../../definitions.ts";

interface ChatbarProps {
  convoState: ConversationState;
  setConvoState: React.Dispatch<React.SetStateAction<ConversationState>>;
  currentPage: Page;
}

export default function Chatbar(props: ChatbarProps) {
  const currentPage = props.currentPage;
  const textareaRef = useRef<HTMLDivElement>(null);
  const handleClick = () => {
    if (textareaRef.current) {
      const userInput = textareaRef.current.innerText;
      if (userInput.trim()) {
        inferModel(
          props.setConvoState,
          props.convoState,
          userInput,
          currentPage,
        );
        textareaRef.current.innerText = "";
      }
    }
  };

  return (
    <div id="chatbar-container">
      <div id="chatbar">
        <div id="chatbar-idk">
          <div
            contentEditable="true"
            data-placeholder="Type Any Message"
            id="chatbar-textarea"
            ref={textareaRef}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleClick();
              }
            }}
            onInput={(e) => {
              let html = e.currentTarget.innerHTML;
              if (html.trim() === "<br>") html = "";
            }}
          />

          <div id="chatbar-btn-container">
            <button
              id="chatbar-btn"
              onClick={handleClick}
            >
              <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="icon-2xl"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.1918 8.90615C15.6381 8.45983 16.3618 8.45983 16.8081 8.90615L21.9509 14.049C22.3972 14.4953 22.3972 15.2189 21.9509 15.6652C21.5046 16.1116 20.781 16.1116 20.3347 15.6652L17.1428 12.4734V22.2857C17.1428 22.9169 16.6311 23.4286 15.9999 23.4286C15.3688 23.4286 14.8571 22.9169 14.8571 22.2857V12.4734L11.6652 15.6652C11.2189 16.1116 10.4953 16.1116 10.049 15.6652C9.60265 15.2189 9.60265 14.4953 10.049 14.049L15.1918 8.90615Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <button
        id="clear-chat-btn"
        onClick={() => {
          props.setConvoState((prevConvo) => ({
            ...prevConvo,
            clearChat: true,
          }));
          (document.querySelector("#convo-container")! as HTMLDivElement).style
            .overflowY = "hidden";
        }}
      >
        Clear Chat
      </button>
    </div>
  );
}
