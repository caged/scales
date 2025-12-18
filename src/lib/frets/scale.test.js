import { describe, it, expect } from "vitest";
import { Scale } from "tonal";
import scale from "./scale";

describe("scale tests", () => {
  it("should initialize a scale with the given name", () => {
    const s = scale("A major");
    expect(s.name()).toBe("A major");
  });

  it("should get the notes of the scale", () => {
    const s1 = Scale.get("A minor");
    const s2 = scale("A minor");
    expect(s2.notes().map((n) => n.letter)).toEqual(s1.notes);
  });
});
