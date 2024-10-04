import { all, create } from "mathjs";
const config = {};
const math = create(all, config);
const fetchData = async (): Promise<
    [number[][], { mean: number[]; scale: number[] }]
> => {
    const layers: number[][] = await fetch("./layers.json")
        .then((response) => response.json());
    const scaler: { "mean": number[]; "scale": number[] } = await fetch(
        "./scaler.json",
    )
        .then((response) => response.json());
    return [layers, scaler];
};

export async function inferWeightModel(input: string) {
    const parsedInput = JSON.parse(input).map((row: number[]) =>
        row.map(Number)
    );
    const [layers, scaler] = await fetchData();

    let layerState: number[][] = parsedInput.map((row: number[]) =>
        row.map((value, i) => (value - scaler.mean[i]) / scaler.scale[i])
    );

    layers.forEach((layer: number[], i: number) => {
        if (i < layers.length - 1 && layer.length > 0) {
            layerState = math.add(
                math.multiply(layerState, layer[0]),
                layer[1],
            ) as number[][];
        } else {
            layerState = layerState.map((row: number[]) =>
                row.map((value) => Math.max(value, 0))
            );
        }
    });

    const max = Math.max(...layerState[0]);

    const exp = layerState[0].map((value) => Math.exp(value - max));
    const runningSum = exp.reduce((sum, value) => sum + value, 0);
    const normalizedExp = exp.map((value) => value / runningSum);
    const map = ["underweight", "normal weight", "overweight", "obese"];

    const maxPtr = normalizedExp.reduce((acc, curr, index) => {
        return curr > normalizedExp[acc] ? index : acc;
    }, 0);

    return map[maxPtr];
}
