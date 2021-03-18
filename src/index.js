import { Note, Range } from "@tonaljs/tonal";
export { default as tnps } from "./system/tnps";
export { default as scale } from "./scale";
export { chunk, rotate, getSVGFile, partition } from "./utils";

export function frets(
  tuning = ["E2", "A2", "D3", "G3", "B3", "E4"],
  octaves = 2
) {
  const count = octaves * 12;
  let system;
  let scale;

  const notes = tuning.map((t) => {
    const { oct, letter } = Note.get(t);
    return Range.chromatic([t, `${letter}${oct + 2}`]).map((n) =>
      // Note.get uses a lookup cache that references the same object.
      // This causes problems if you try to add additional propertieis to Note
      // which we do when assigning scale modes.  To work around this, we create a new
      // object for every note.
      Object.assign({}, Note.get(n))
    );
  });
  function fb() {}

  fb.notes = () => notes;
  fb.tuning = () => tuning;
  fb.count = () => count;
  fb.octaves = () => octaves;

  fb.system = function (_) {
    return arguments.length ? ((system = _), fb) : system;
  };

  fb.scale = function (_) {
    return arguments.length ? ((scale = _), fb) : scale;
  };

  return fb;
}
