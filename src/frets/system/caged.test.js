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

  describe("C major pentatonic", () => {
    it("assigns positions using 7-degree mapping (1,2,3,5,6)", () => {
      const scale = Scale.get("C major pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // C major pentatonic: C(1), D(2), E(3), G(5), A(6)
      // On low E: E at fret 0, G at fret 3, A at fret 5, C at fret 8, D at fret 10
      expect(lowE[0].note.pc).toBe("E");
      expect(lowE[0].positions.CAGED).toBeDefined();
      expect(lowE[0].positions.CAGED.length).toBeGreaterThan(0);

      expect(lowE[3].note.pc).toBe("G");
      expect(lowE[3].positions.CAGED).toBeDefined();

      expect(lowE[5].note.pc).toBe("A");
      expect(lowE[5].positions.CAGED).toBeDefined();

      expect(lowE[8].note.pc).toBe("C");
      expect(lowE[8].positions.CAGED).toBeDefined();

      expect(lowE[10].note.pc).toBe("D");
      expect(lowE[10].positions.CAGED).toBeDefined();
    });

    it("assigns all 5 positions across the fretboard", () => {
      const scale = Scale.get("C major pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      const allPositions = new Set();
      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.CAGED) {
            note.positions.CAGED.forEach((p) => allPositions.add(p));
          }
        }
      }

      expect(allPositions.size).toBe(5);
      expect([...allPositions].sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it("assigns correct intervals to scale notes", () => {
      const scale = Scale.get("C major pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      // C major pentatonic intervals: 1P, 2M, 3M, 5P, 6M
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

  describe("C minor pentatonic", () => {
    it("assigns positions with rotation for minor scale", () => {
      const scale = Scale.get("C minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const lowE = fb.strings[5];

      // C minor pentatonic: C(1), Eb(3), F(4), G(5), Bb(7)
      // On low E: F at fret 1, G at fret 3, Bb at fret 6, C at fret 8
      expect(lowE[1].note.pc).toBe("F");
      expect(lowE[1].positions.CAGED).toBeDefined();
      expect(lowE[1].positions.CAGED.length).toBeGreaterThan(0);

      expect(lowE[3].note.pc).toBe("G");
      expect(lowE[3].positions.CAGED).toBeDefined();

      expect(lowE[6].note.pc).toBe("Bb");
      expect(lowE[6].positions.CAGED).toBeDefined();

      expect(lowE[8].note.pc).toBe("C");
      expect(lowE[8].positions.CAGED).toBeDefined();
    });

    it("assigns all 5 positions across the fretboard", () => {
      const scale = Scale.get("C minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      const allPositions = new Set();
      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.CAGED) {
            note.positions.CAGED.forEach((p) => allPositions.add(p));
          }
        }
      }

      expect(allPositions.size).toBe(5);
      expect([...allPositions].sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it("assigns correct intervals to scale notes", () => {
      const scale = Scale.get("C minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);

      // C minor pentatonic intervals: 1P, 3m, 4P, 5P, 7m
      const expectedIntervals = ["1P", "3m", "4P", "5P", "7m"];

      for (const string of fb.strings) {
        for (const note of string) {
          if (note.interval) {
            expect(expectedIntervals).toContain(note.interval);
          }
        }
      }
    });
  });

  describe("pentatonic position assignment", () => {
    it("assigns positions to all pentatonic scale notes", () => {
      const scale = Scale.get("A minor pentatonic");
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

    it("assigns positions between 1 and 5 for pentatonic", () => {
      const scale = Scale.get("G major pentatonic");
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

    it("does not assign positions to non-scale notes for pentatonic", () => {
      const scale = Scale.get("E minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      const scaleNotes = scale.notes.map((n) => n.replace(/[0-9]/g, ""));

      for (const string of fb.strings) {
        for (const note of string) {
          if (!scaleNotes.includes(note.note.pc)) {
            expect(
              note.positions.CAGED === undefined ||
                note.positions.CAGED.length === 0
            ).toBe(true);
          }
        }
      }
    });
  });
});
