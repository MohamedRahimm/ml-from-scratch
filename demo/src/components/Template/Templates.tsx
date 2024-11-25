import "./Templates.css";
import { ConversationState, Page } from "../../definitions.ts";
import { weightTemplate, sentimentTemplate } from "./template.ts";
interface Template {
    title: string;
    svg: JSX.Element;
    HandleClick: () => void;
}

export default function Templates(
    props: {
        currentPage: Page;
        setConvoState: React.Dispatch<React.SetStateAction<ConversationState>>;
    },
) {
    const templateItems: Template[] = [
        {
            "title": "Load Template Conversation",
            "svg": (
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
            ),
            "HandleClick": () => {
                props.currentPage === "Weight Categorizer" &&
                    props.setConvoState((prevState) => ({
                        ...prevState,
                        "messages": weightTemplate.messages,
                        "modelsUsed": weightTemplate.modelsUsed,
                        "infoGathered": true,
                    }));
                props.currentPage === "Sentiment Analysis" &&
                    props.setConvoState((prevState) => ({
                        ...prevState,
                        "messages": sentimentTemplate.messages,
                        "modelsUsed": sentimentTemplate.modelsUsed,
                    }));
                document.querySelector(".template")
                    ?.scrollIntoView({
                        "behavior": "smooth",
                        "block": "start",
                    });
            },
        },
    ];
    return (
        <div id="template-container">
            {templateItems.map((template, index) => (
                <div
                    key={index}
                    className="template"
                    onClick={template.HandleClick}
                >
                    <div className="icon-container">
                        {template.svg}
                    </div>
                    {template.title}
                </div>
            ))}
        </div>
    );
}
