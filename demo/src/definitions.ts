export interface Message {
    role: "user" | "system";
    content: string;
}

export interface ChatRequest {
    messages: Message[];
    model: string;
    temperature: number;
    max_tokens: number;
    top_p: number;
    stream: boolean;
    stop: string | null;
}

export type modelUsed = "Llama3" | "Weight-Cat" | "Senti-Analysis" | "";

export type Page = "Weight Categorizer" | "Sentiment Analysis";
export interface ConversationState {
    "messages": Message[];
    "modelsUsed": modelUsed[];
    "infoGathered": boolean;
    "clearChat": boolean;
}
