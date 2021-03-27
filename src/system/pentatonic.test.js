import pentatonic from "./pentatonic";
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
    dms = scale("A minor pentatonic");
    strings = pentatonic(notes, dms);
  });

  it("gets the positions of the given scale", () => {
    const strings = pentatonic(frets().notes(), scale("A minor pentatonic"));
    const e = strings[0];
    const anote = e[5];

    assert.equal(anote.name, "A2");
    assert.equal(anote.interval, "1P");
    assert.deepEqual(anote.positions, [1, 5]);
  });
});
