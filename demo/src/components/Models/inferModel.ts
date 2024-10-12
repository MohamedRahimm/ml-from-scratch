import { Conversation, Page } from "../../App.tsx";
import inferLlama3 from "./weight-categorizer/groq.ts";
import inferSentimentModel from "./sentiment.ts";
export default async function inferModel(
    currPage: Page,
    setConvo: React.Dispatch<
        React.SetStateAction<Conversation>
    >,
    convo: Conversation,
    userInput: string,
    infoGathered: boolean,
    setInfoGathered: React.Dispatch<
        React.SetStateAction<
            boolean
        >
    >,
) {
    switch (currPage) {
        case "Weight Categorizer": {
            await inferLlama3(
                setConvo,
                convo,
                userInput,
                infoGathered,
                setInfoGathered,
            );

            break;
        }

        case ("Sentiment Analysis"): {
            const output = await inferSentimentModel(userInput);
            setConvo((prevConvo) => ({
                messages: [...prevConvo.messages, {
                    "role": "user",
                    "content": userInput,
                }, {
                    "role": "system",
                    "content": output,
                }],
                modelsUsed: [...prevConvo.modelsUsed, "Senti-Analysis"],
            }));
        }
    }
}
