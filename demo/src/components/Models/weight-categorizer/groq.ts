import { ConversationState, modelUsed } from "../../../definitions.ts";

interface weightObject {
    age: number;
    gender: "male" | "female";
    height: string;
    weight: string;
    physicalActivityLevel: number;
}

async function fetchLlama3(userInput: string, convoState: ConversationState) {
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
                        `You are an AI tasked with gathering 5 specific details from the user: age, gender, height, weight, and physical activity level (on a scale of 1-4). Ensure that each response follows the correct format: height should be either in the form "xft,yin" for feet and inches or with "cm" for centimeters; weight must be labeled with "lbs" or "kg"; gender should be either "male" or "female"; and the physical activity level must fall within the 1-4 range. If the user does not provide any of these details, ask standalone questions until all fields are complete. Once the information is gathered,respond with a JSON object with the properties age, gender, height, weight, and physicalActivityLevel, WITH NO ADDITIONAL TEXT, ensuring none of the values are null. Avoid converting measurements, and adhere strictly to the user's input formats.`,
                },
                ...convoState.messages,
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

function convertTo2DArray(data: weightObject): number[][] {
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
function preprocessData(data: string): string | weightObject {
    data = data.slice(data.indexOf("{"), data.indexOf("}") + 1);
    const cleanedData: weightObject = JSON.parse(data);
    // deno-lint-ignore no-explicit-any
    function isNotNum(val: any) {
        return (typeof val !== "number" ||
            (typeof val === "number" && isNaN(val)));
    }
    const numericFields: Array<keyof weightObject> = [
        "age",
        "gender",
        "height",
        "weight",
        "physicalActivityLevel",
    ];

    for (const prop of numericFields) {
        if (prop === "physicalActivityLevel" && isNotNum(cleanedData[prop])) {
            return `What would you say your physical activity level is on a scale from 1-4?`;
        } else if (typeof prop !== "string") return `What is your ${prop}?`;
    }
    return cleanedData;
}
export default async function inferLlama3(
    setConvoState: React.Dispatch<
        React.SetStateAction<ConversationState>
    >,
    convoState: ConversationState,
    userInput: string,
) {
    function updateConvo(
        role: "user" | "system",
        content: string,
        modelUsed?: modelUsed,
    ) {
        setConvoState((prevConvo) => ({
            ...prevConvo,
            messages: [...prevConvo.messages, {
                role,
                content,
            }],
            modelsUsed: modelUsed
                ? [...prevConvo.modelsUsed, modelUsed]
                : prevConvo.modelsUsed,
        }));
    }
    if (!convoState.infoGathered) {
        updateConvo("user", userInput);
        await fetchLlama3(userInput, convoState).then((response) =>
            response.json()
        )
            .then(async (data) => {
                if (data["message"].includes("{")) {
                    const cleanData = preprocessData(data["message"]);
                    if (typeof cleanData === "object") {
                        await import("./weight.ts").then(
                            async ({ default: inferWeightModel }) => {
                                const model = await inferWeightModel(
                                    convertTo2DArray(cleanData as weightObject),
                                );
                                updateConvo(
                                    "system",
                                    model,
                                    "Weight-Cat",
                                );
                                setConvoState((prevState) => ({
                                    ...prevState,
                                    infoGathered: true,
                                }));
                            },
                        );
                    } else {
                        updateConvo(
                            "system",
                            cleanData as string,
                        );
                    }
                } else {
                    updateConvo("system", data["message"], "Llama3");
                }
            })
            .catch(() => {
                updateConvo(
                    "system",
                    "There was an error please try again.",
                    "Llama3",
                );
            });
    } else {
        setConvoState((prevState) => ({
            ...prevState,
            messages: [...prevState.messages, {
                role: "user",
                content: userInput,
            }, {
                role: "system",
                content:
                    "Are you trying to change your information? Hit the clear chat button",
            }],
            modelsUsed: [...prevState.modelsUsed, ""],
        }));
    }
}
