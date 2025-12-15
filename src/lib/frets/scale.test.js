import { Scale } from "tonal";
import scale from "./scale";
import { assert } from "chai";

describe("scale tests", () => {
  it("should initialize a scale with the given name", () => {
    const s = scale("A major");
    assert.equal(s.name(), "A major");
  });

  it("should get the notes of the scale", () => {
    const s1 = Scale.get("A minor");
    const s2 = scale("A minor");
    assert.deepEqual(
      s2.notes().map((n) => n.letter),
      s1.notes
    );
  });
});
