import { Note } from "@tonaljs/tonal";
import tnps from "./tnps";
import { frets, scale } from "../";
import { assert } from "chai";

describe("three note per string tests", () => {
  it("gets the positions of the given scale", () => {
    const fb = frets();
    const ams = scale("A minor");
    const t = tnps(fb.notes(), ams);
    assert.equal(t.positions().length, 7);
  });
});
