import { Note, Range } from "@tonaljs/tonal";
import { frets, tnps } from "./";
import { assert } from "chai";

// {
//   empty: false,
//   acc: '',
//   alt: 0,
//   chroma: 4,
//   coord: [ 4, 0 ],
//   freq: 82.40688922821748,
//   height: 40,
//   letter: 'E',
//   midi: 40,
//   name: 'E2',
//   oct: 2,
//   pc: 'E',
//   step: 2
// }

describe("fretboard tests", () => {
  it("should initialize with standard tuning", () => {
    const fb = frets();
    assert.deepEqual(fb.tuning(), ["E2", "A2", "D3", "G3", "B3", "E4"]);
    assert.equal(fb.count(), 24);
    assert.equal(fb.octaves(), 2);
  });

  it("should create two octaves of notes data when initialized", () => {
    const fb = frets();
    const notes = fb.notes();
    assert.isArray(notes);
    assert.equal(notes[0].length, 25);

    fb.tuning().forEach((note, i) => {
      const { letter, oct } = Note.get(note);
      assert.equal(notes[i][0].name, note);
      assert.equal(notes[i][notes[i].length - 1].name, `${letter}${oct + 2}`);
    });
  });

  it("should create a chromatic range of notes for string", () => {
    const fb = frets();
    const strings = fb.notes();
    const e = strings[0];
    const enames = e.map((n) => n.name);

    assert.deepEqual(enames, Range.chromatic(["E2", "E4"]));
  });

  it("should set a system", () => {
    const fb = frets().system(tnps);
    assert.deepEqual(fb.system(), tnps);
    assert.isFunction(fb.system());
  });
});
