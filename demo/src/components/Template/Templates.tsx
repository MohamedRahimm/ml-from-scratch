import "./Templates.css";
import { ConversationState, Page } from "../../definitions.ts";

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
                        "infoGathered": true,
                    }));
                props.currentPage === "Sentiment Analysis" &&
                    props.setConvoState((prevState) => ({
                        ...prevState,
                        "messages": [
                            {
                                "role": "user",
                                "content":
                                    "I hated this movie, it was complete garbage and a waste of money.",
                            },
                            {
                                "role": "system",
                                "content": "This statement is negative",
                            },
                            {
                                "role": "user",
                                "content":
                                    "Best movie I have ever seen hands down. MUST WATCH",
                            },
                            {
                                "role": "system",
                                "content": "This statement is positive",
                            },
                        ],
                        modelsUsed: ["Senti-Analysis", "Senti-Analysis"],
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
