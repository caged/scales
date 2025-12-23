import { writable } from "svelte/store";

const bpm = writable(120);

export { bpm };
