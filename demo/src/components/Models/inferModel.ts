import { Page } from "../../App.tsx";
import { inferWeightModel } from "./weight.ts";
export default function inferModel(
    currPage: Page,
    setConvo: React.Dispatch<
        React.SetStateAction<{ user: string[]; model: string[] }>
    >,
    userInput: string,
) {
    switch (currPage) {
        case "Weight Categorizer": {
            (async function () {
                const model = await inferWeightModel(userInput);
                setConvo((prevConvo) => ({
                    ...prevConvo,
                    user: [...prevConvo.user, userInput],
                    model: [...prevConvo.model, model],
                }));
            })();
            break;
        }
        case ("Sentiment Analysis"): {
        }
    }
}
