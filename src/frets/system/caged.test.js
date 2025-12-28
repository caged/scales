import { describe, expect, it } from "vitest";
import { Scale } from "tonal";
import frets from "../index.js";
import caged from "./caged.js";

describe("CAGED system", () => {
  describe("C major scale", () => {
    it("assigns G shape (position 5) correctly - starts at fret 5 with A, B, C", () => {
      const scale = Scale.get("C major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5]; // Low E string (reversed order)

      // G shape pattern on low E has degrees [6, 7, 1] = A, B, C
      expect(lowE[5].note.pc).toBe("A");
      expect(lowE[5].positions.CAGED).toContain(5);

      expect(lowE[7].note.pc).toBe("B");
      expect(lowE[7].positions.CAGED).toContain(5);

      expect(lowE[8].note.pc).toBe("C");
      expect(lowE[8].positions.CAGED).toContain(5);
    });

    it("assigns E shape (position 1) correctly - starts at open position", () => {
      const scale = Scale.get("C major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // E shape pattern on low E has degrees [7, 1, 2] = B, C, D
      expect(lowE[7].note.pc).toBe("B");
      expect(lowE[7].positions.CAGED).toContain(1);

      expect(lowE[8].note.pc).toBe("C");
      expect(lowE[8].positions.CAGED).toContain(1);

      expect(lowE[10].note.pc).toBe("D");
      expect(lowE[10].positions.CAGED).toContain(1);
    });
  });

  describe("C minor scale", () => {
    it("assigns G shape (position 5) correctly - starts at fret 8 with C, D, Eb", () => {
      const scale = Scale.get("C minor");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // For minor, G shape pattern rotates +2, so low E has degrees [1, 2, 3] = C, D, Eb
      expect(lowE[8].note.pc).toBe("C");
      expect(lowE[8].positions.CAGED).toContain(5);

      expect(lowE[10].note.pc).toBe("D");
      expect(lowE[10].positions.CAGED).toContain(5);

      // Use label which reflects the scale's spelling (E♭ not D#)
      expect(lowE[11].label).toBe("E♭");
      expect(lowE[11].positions.CAGED).toContain(5);
    });
  });

  describe("error handling", () => {
    it("throws error for chromatic scale (12 notes)", () => {
      const chromatic = Scale.get("C chromatic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16);
      expect(() => caged(fb.strings, chromatic)).toThrow(
        "CAGED system only works with 5-note pentatonic or 7-note scales"
      );
    });

    it("throws error for 6-note scales", () => {
      const blues = Scale.get("C blues");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16);
      expect(() => caged(fb.strings, blues)).toThrow(
        "CAGED system only works with 5-note pentatonic or 7-note scales"
      );
    });
  });

  describe("position assignment", () => {
    it("assigns positions to all scale notes", () => {
      const scale = Scale.get("G major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      for (const string of fb.strings) {
        for (const note of string) {
          if (note.interval) {
            expect(note.positions.CAGED).toBeDefined();
            expect(Array.isArray(note.positions.CAGED)).toBe(true);
            expect(note.positions.CAGED.length).toBeGreaterThan(0);
          }
        }
      }
    });

    it("assigns positions between 1 and 5", () => {
      const scale = Scale.get("A minor");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.CAGED?.length > 0) {
            for (const pos of note.positions.CAGED) {
              expect(pos).toBeGreaterThanOrEqual(1);
              expect(pos).toBeLessThanOrEqual(5);
            }
          }
        }
      }
    });

    it("does not assign positions to non-scale notes", () => {
      const scale = Scale.get("C major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      for (const string of fb.strings) {
        for (const note of string) {
          if (!note.interval) {
            expect(
              note.positions.CAGED === undefined ||
                note.positions.CAGED.length === 0
            ).toBe(true);
          }
        }
      }
    });
  });

  describe("works with different keys", () => {
    it("works with G major", () => {
      const scale = Scale.get("G major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // G is at fret 3, should be in position 5 (G shape starts on root)
      expect(lowE[3].note.pc).toBe("G");
      expect(lowE[3].positions.CAGED).toContain(5);
    });

    it("works with E minor", () => {
      const scale = Scale.get("E minor");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // E is at fret 0 (open), should be in G shape (position 5) for minor
      expect(lowE[0].note.pc).toBe("E");
      expect(lowE[0].positions.CAGED).toContain(5);
    });
  });
});
