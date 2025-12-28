import { describe, expect, it } from "vitest";
import { Note, Scale } from "tonal";
import frets from "../index.js";
import pentatonic from "./pentatonic.js";

describe("Pentatonic system", () => {
  describe("A minor pentatonic", () => {
    it("assigns G shape (position 1) correctly - root on low E at fret 5", () => {
      const scale = Scale.get("A minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // G shape pattern on low E has degrees [1, 2] = A, C (root, minor 3rd)
      expect(lowE[5].note.pc).toBe("A");
      expect(lowE[5].positions.Pentatonic).toContain(1);

      expect(lowE[8].note.pc).toBe("C");
      expect(lowE[8].positions.Pentatonic).toContain(1);
    });

    it("assigns E shape (position 2) correctly", () => {
      const scale = Scale.get("A minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // E shape pattern on low E has degrees [2, 3] = C, D
      expect(lowE[8].note.pc).toBe("C");
      expect(lowE[8].positions.Pentatonic).toContain(2);

      expect(lowE[10].note.pc).toBe("D");
      expect(lowE[10].positions.Pentatonic).toContain(2);
    });

    it("assigns all 5 positions across the fretboard", () => {
      const scale = Scale.get("A minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      const allPositions = new Set();
      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.Pentatonic) {
            note.positions.Pentatonic.forEach((p) => allPositions.add(p));
          }
        }
      }

      expect(allPositions.size).toBe(5);
      expect([...allPositions].sort()).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe("C major pentatonic", () => {
    it("assigns positions with rotation for major scale", () => {
      const scale = Scale.get("C major pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      // Verify positions are assigned
      let hasPositions = false;
      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.Pentatonic?.length > 0) {
            hasPositions = true;
            break;
          }
        }
      }
      expect(hasPositions).toBe(true);
    });

    it("assigns correct intervals to scale notes", () => {
      const scale = Scale.get("C major pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      // C major pentatonic: C(1P), D(2M), E(3M), G(5P), A(6M)
      const expectedIntervals = ["1P", "2M", "3M", "5P", "6M"];

      for (const string of fb.strings) {
        for (const note of string) {
          if (note.interval) {
            expect(expectedIntervals).toContain(note.interval);
          }
        }
      }
    });
  });

  describe("error handling", () => {
    it("throws error for non-pentatonic scales", () => {
      const majorScale = Scale.get("C major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16);
      expect(() => pentatonic(fb.strings, majorScale)).toThrow(
        "Does not appear to be a pentatonic scale"
      );
    });

    it("throws error for blues scale (6 notes)", () => {
      const blues = Scale.get("A blues");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16);
      expect(() => pentatonic(fb.strings, blues)).toThrow(
        "Does not appear to be a pentatonic scale"
      );
    });
  });

  describe("position assignment", () => {
    it("assigns positions to all scale notes", () => {
      const scale = Scale.get("E minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      for (const string of fb.strings) {
        for (const note of string) {
          if (note.interval) {
            expect(note.positions.Pentatonic).toBeDefined();
            expect(Array.isArray(note.positions.Pentatonic)).toBe(true);
            expect(note.positions.Pentatonic.length).toBeGreaterThan(0);
          }
        }
      }
    });

    it("assigns positions between 1 and 5", () => {
      const scale = Scale.get("G minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.Pentatonic?.length > 0) {
            for (const pos of note.positions.Pentatonic) {
              expect(pos).toBeGreaterThanOrEqual(1);
              expect(pos).toBeLessThanOrEqual(5);
            }
          }
        }
      }
    });

    it("does not assign positions to non-scale notes", () => {
      const scale = Scale.get("A minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const scaleChroma = scale.notes.map((n) => Note.get(n).chroma);

      for (const string of fb.strings) {
        for (const note of string) {
          if (!scaleChroma.includes(note.note.chroma)) {
            expect(
              note.positions.Pentatonic === undefined ||
                note.positions.Pentatonic.length === 0
            ).toBe(true);
          }
        }
      }
    });
  });

  describe("works with different keys", () => {
    it("works with D minor pentatonic", () => {
      const scale = Scale.get("D minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // D is at fret 10
      expect(lowE[10].note.pc).toBe("D");
      expect(lowE[10].positions.Pentatonic).toBeDefined();
      expect(lowE[10].positions.Pentatonic.length).toBeGreaterThan(0);
    });

    it("works with G major pentatonic", () => {
      const scale = Scale.get("G major pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // G is at fret 3
      expect(lowE[3].note.pc).toBe("G");
      expect(lowE[3].positions.Pentatonic).toBeDefined();
      expect(lowE[3].positions.Pentatonic.length).toBeGreaterThan(0);
    });
  });

  describe("same note gets same positions on same string", () => {
    it("assigns identical positions to same chroma on same string", () => {
      const scale = Scale.get("A minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 24, scale);

      for (const string of fb.strings) {
        const notesByChroma = {};

        for (const note of string) {
          if (note.positions.Pentatonic?.length > 0) {
            if (!notesByChroma[note.note.chroma]) {
              notesByChroma[note.note.chroma] = [];
            }
            notesByChroma[note.note.chroma].push(note);
          }
        }

        for (const notes of Object.values(notesByChroma)) {
          if (notes.length > 1) {
            const firstPositions = JSON.stringify(notes[0].positions.Pentatonic);
            for (const note of notes) {
              expect(JSON.stringify(note.positions.Pentatonic)).toBe(
                firstPositions
              );
            }
          }
        }
      }
    });
  });
});
