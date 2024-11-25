import { Message, modelUsed } from "../../definitions"

interface Template{
    messages: Message[]
    modelsUsed: modelUsed[]
}
export const weightTemplate:Template= {
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
}

export const sentimentTemplate:Template = {
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
}
