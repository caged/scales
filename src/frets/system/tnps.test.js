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

  it("gets the positions of the given scale", () => {
    const strings = tnps(frets().notes(), scale("D minor"));
    const e = strings[0];
    const enote = e[0];
    const dnote = e[10];

    assert.equal(enote.name, "E2");
    assert.equal(dnote.name, "D3");
    assert.equal(dnote.interval, "1P");
    assert.deepEqual(enote.positions, [1, 2, 7]);
    assert.deepEqual(dnote.positions, [1, 6, 7]);
  });
});
