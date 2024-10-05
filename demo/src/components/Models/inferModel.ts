import { Convo, Page } from "../../App.tsx";
import inferLlama3 from "./weight-categorizer/groq.ts";
// import React from "npm:@types/react@^18.3";

export default async function inferModel(
    currPage: Page,
    setConvo: React.Dispatch<
        React.SetStateAction<Convo>
    >,
    convo: Convo,
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

            // case ("Sentiment Analysis"): {
            // }
    }
}
