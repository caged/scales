import { Note } from "@tonaljs/tonal";
import scale from "./scale";
import { assert } from "chai";

describe("scale tests", () => {
  it("should initialize a scale with the given name", () => {
    const s = scale("A major");
    assert.equal(s.name(), "A major");
  });
});
