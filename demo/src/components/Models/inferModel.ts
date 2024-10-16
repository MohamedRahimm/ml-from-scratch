import { ConversationState, Page } from "../../definitions.ts";

export default async function inferModel(
    setConvoState: React.Dispatch<
        React.SetStateAction<ConversationState>
    >,
    convoState: ConversationState,
    userInput: string,
    currPage: Page,
) {
    switch (currPage) {
        case "Weight Categorizer": {
            await import("./weight-categorizer/groq.ts").then(async (
                { default: inferLlama3 },
            ) => {
                await inferLlama3(
                    setConvoState,
                    convoState,
                    userInput,
                );
            });

            break;
        }

        case ("Sentiment Analysis"): {
            await import("./sentiment.ts").then(async (
                { default: inferSentimentModel },
            ) => await inferSentimentModel(userInput, setConvoState));
        }
    }
}
