import { Note, Scale, ScaleType, Range, Mode } from "@tonaljs/tonal";
import { fsum } from "d3-array";
export { default as tnps } from "./system/tnps";
export { default as utils } from "./utils";
export { default as caged } from "./system/caged";
export { default as mode } from "./system/mode";

export function frets(
  tuning = ["E2", "A2", "D3", "G3", "B3", "E4"],
  octaves = 2
) {
  const count = octaves * 12;
  let system;

  const notes = tuning.map((t) => {
    const { oct, letter } = Note.get(t);
    return Range.chromatic([t, `${letter}${oct + 2}`]).map(Note.get);
  });
  function fb() {}

  fb.notes = () => notes;
  fb.tuning = () => tuning;
  fb.count = () => count;
  fb.octaves = () => octaves;

  fb.system = function (_) {
    return arguments.length ? ((system = _), fb) : system;
  };

  return fb;
}
