import { derived, writable } from "svelte/store";

import { scale as getScale } from "../frets/index";

const tuning = writable(["E2", "A2", "D3", "G3", "B3", "E4"]);
const tonic = writable("A");
const bpm = writable(120);
const scale = derived([tuning, tonic], ($tuning, $tonic) => {
  console.log("scale updated", $tuning, $tonic);
  return `The scale is ${tuning} and ${tonic}`;
});

export { tuning, tonic, scale, bpm };
