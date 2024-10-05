import { Convo } from "../../../App.tsx";
import { inferWeightModel } from "./weight.ts";

async function fetchLlama3(userInput: string, convo: Convo) {
    return await fetch("https://groq-proxy-server.vercel.app/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            "messages": [
                {
                    "role": "system",
                    "content":
                        `You are an AI gathering 5 details about the user: their age, gender, height, weight, and physical activity level(on a scale from 1-4).If the user doesn't provide any of this information, continue requesting it in standalone questions until all details are received. Once you have gathered all the required data, WITH NO ADDITIONAL TEXT return a JSON object with the properties age,gender,height,physicalActivityLevel,weight with their respective values. Ensure that height is in the format xft,yin if the user responds in feet, or suffix the number with cm if given in cm, and weight is suffixed with lbs or kg where appropriate, and gender is either male or female, and physical activity level is in the provided range. DO NOT TRY TO CONVERT MEASUREMENTS AND TELL THE USER THE GIVEN CONSTRAINTS`,
                },
                ...convo.messages,
                {
                    "role": "user",
                    "content": userInput,
                },
            ],
            "model": "llama3-70b-8192",
            "temperature": 1,
            "max_tokens": 1024,
            "top_p": 1,
            "stream": false,
            "stop": null,
        }),
    });
}
export function updateConvo(
    setConvo: React.Dispatch<
        React.SetStateAction<Convo>
    >,
    role: "user" | "system",
    content: string,
) {
    setConvo((prevConvo) => ({
        messages: [...prevConvo.messages, {
            role,
            content,
        }],
    }));
}
function convertTo2DArray(data: {
    age: number;
    gender: "male" | "female";
    height: string;
    weight: string;
    physicalActivityLevel: number;
}): number[][] {
    let heightInCm: number;
    if (data.height.includes("cm")) {
        heightInCm = parseInt(data.height);
    } else {
        const [feet, inches] = data.height.split(/[ft,in]+/).map(Number);
        heightInCm = (feet * 30.48) + (inches * 2.54); // Convert to cm
    }

    let weightInKg: number;
    if (data.weight.includes("kg")) {
        weightInKg = parseInt(data.weight);
    } else {
        weightInKg = parseInt(data.weight) * 0.453592;
    }

    const heightInMeters = heightInCm / 100;
    const bmi = weightInKg / (heightInMeters * heightInMeters);
    const gender2Int = data.gender === "male" ? 0 : 1;
    // add type assertions
    return [
        [
            data.age,
            gender2Int,
            heightInCm,
            weightInKg,
            bmi,
            data.physicalActivityLevel,
        ],
    ];
}
export default async function inferLlama3(
    setConvo: React.Dispatch<
        React.SetStateAction<Convo>
    >,
    convo: Convo,
    userInput: string,
    infoGathered: boolean,
    setInfoGathered: React.Dispatch<
        React.SetStateAction<boolean>
    >,
) {
    if (!infoGathered) {
        updateConvo(setConvo, "user", userInput);
        await fetchLlama3(userInput, convo).then((response) => response.json())
            .then(async (data) => {
                if (data["message"][0] === "{") {
                    setInfoGathered(true);
                    const model = await inferWeightModel(
                        convertTo2DArray(JSON.parse(data["message"])),
                    );
                    updateConvo(setConvo, "system", model);
                } else {
                    updateConvo(setConvo, "system", data["message"]);
                }
            })
            .catch(() => {
                updateConvo(
                    setConvo,
                    "system",
                    "There was an error please try again.",
                );
            });
    } else {
        setConvo((prevConvo) => ({
            messages: [...prevConvo.messages, {
                role: "user",
                content: userInput,
            }, {
                role: "system",
                content:
                    "Are you trying to change data? Hit the clear chat button",
            }],
        }));
    }
}
