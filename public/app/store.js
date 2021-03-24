import { writable } from "svelte/store";

const tuning = writable(["E2", "A2", "D3", "G3", "B3", "E4"]);
const tonic = writable("A");

export { tuning, tonic };
