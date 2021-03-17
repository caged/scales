import tnps from "./tnps";
import { frets, scale } from "../";
import { assert } from "chai";

describe("three note per string tests", () => {
  let fb;
  let strings;
  let dms;
  let notes;

  beforeEach(() => {
    fb = frets();
    notes = fb.notes();
    dms = scale("D minor");
    strings = tnps(notes, dms);
  });

  // it("gets tnps for string at index", () => {
  //   const notesForEPositions = mode
  //     .forString(0)
  //     .map((p) => p.map((n) => n.name));

  //   const notesForAPositions = mode
  //     .forString(1)
  //     .map((p) => p.map((n) => n.name));

  //   assert.deepEqual(notesForEPositions, [
  //     ["D", "E", "F"],
  //     ["E", "F", "G"],
  //     ["F", "G", "A"],
  //     ["G", "A", "Bb"],
  //     ["A", "Bb", "C"],
  //     ["Bb", "C", "D"],
  //     ["C", "D", "E"],
  //   ]);

  //   assert.deepEqual(notesForAPositions, [
  //     ["G", "A", "Bb"],
  //     ["A", "Bb", "C"],
  //     ["Bb", "C", "D"],
  //     ["C", "D", "E"],
  //     ["D", "E", "F"],
  //     ["E", "F", "G"],
  //     ["F", "G", "A"],
  //   ]);
  // });

  it("gets the positions of the given scale", () => {
    const strs = tnps(frets().notes(), scale("D minor"));
    // console.log(strs);
    // const e = strings[0];
    // const enote = e[0];
    // const dnote = e[10];

    console.log(strs[0].map((n) => [n.name, n.positions]));

    // assert.equal(enote.name, "E2");
    // assert.equal(dnote.name, "D3");
    // assert.equal(dnote.interval, "1P");
    // assert.deepEqual(enote.positions, [1, 2, 7]);
    // assert.deepEqual(dnote.positions, [1, 6, 7]);
  });
});
