import { env, PreTrainedTokenizer } from "@xenova/transformers";
import * as ort from "onnxruntime-web";

export default async function inferSentimentModel(input: string) {
    env.localModelPath = "/ml-from-scratch/";
    ort.env.wasm.wasmPaths = "/ml-from-scratch/";

    const session = await ort.InferenceSession.create("sentiment.onnx");
    const tokenizer = await PreTrainedTokenizer.from_pretrained("");

    const { input_ids } = await tokenizer(input);
    const id_arr = new BigInt64Array(150).fill(30_000n);
    for (let i = 0; i < input_ids.data.length; i++) {
        id_arr[i] = input_ids.data[i];
    }

    const id_tensor = new ort.Tensor("int64", id_arr, [1, 150]);
    const feeds = { "input": id_tensor };
    const results = await session.run(feeds);

    const modelOutput = results.output.data;
    let output = "";
    modelOutput[0] > modelOutput[1]
        ? output = "This statement is negative"
        : output = "This statement is positive";
    return output;
}
