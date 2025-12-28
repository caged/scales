import { describe, expect, it } from "vitest";
import { Scale } from "tonal";
import frets from "../index.js";

describe("CAGED system", () => {
  it("assigns G shape (position 5) correctly for C major", () => {
    const scale = Scale.get("C major");
    const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
    const lowE = fb.strings[5]; // Low E string (reversed order)

    // G shape on low E string should have A (fret 5), B (fret 7), C (fret 8)
    const aNote = lowE[5];
    const bNote = lowE[7];
    const cNote = lowE[8];

    expect(aNote.note.pc).toBe("A");
    expect(aNote.positions.CAGED).toContain(5);

    expect(bNote.note.pc).toBe("B");
    expect(bNote.positions.CAGED).toContain(5);

    expect(cNote.note.pc).toBe("C");
    expect(cNote.positions.CAGED).toContain(5);
  });
});
