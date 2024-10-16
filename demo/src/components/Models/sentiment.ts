import {
    env as transformerEnv,
    PreTrainedTokenizer,
} from "@xenova/transformers";
import { env, InferenceSession, Tensor } from "onnxruntime-web";
import { ConversationState } from "../../definitions.ts";

export default async function inferSentimentModel(
    input: string,
    setConvoState: React.Dispatch<React.SetStateAction<ConversationState>>,
) {
    transformerEnv.localModelPath = "/ml-from-scratch/";
    env.wasm.wasmPaths = "/ml-from-scratch/";

    const session = await InferenceSession.create("sentiment.onnx");
    const tokenizer = await PreTrainedTokenizer.from_pretrained("");

    const { input_ids } = await tokenizer(input);
    const id_arr = new BigInt64Array(150).fill(30_000n);
    for (let i = 0; i < input_ids.data.length; i++) {
        id_arr[i] = input_ids.data[i];
    }

    const id_tensor = new Tensor("int64", id_arr, [1, 150]);
    const feeds = { "input": id_tensor };
    const results = await session.run(feeds);

    const modelOutput = results.output.data;
    let output = "";
    modelOutput[0] > modelOutput[1]
        ? output = "This statement is negative"
        : output = "This statement is positive";

    setConvoState((prevConvo) => ({
        ...prevConvo,
        messages: [...prevConvo.messages, {
            "role": "user",
            "content": input,
        }, {
            "role": "system",
            "content": output,
        }],
        modelsUsed: [...prevConvo.modelsUsed, "Senti-Analysis"],
    }));
}
