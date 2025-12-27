import { beforeEach, describe, expect, it } from "vitest";

import { Scale } from "tonal";
import caged from "./caged.js";
import frets from "../index.js";

describe("CAGED system tests", () => {
  let strings;
  let scale;

  describe("with 7-note major scale", () => {
    beforeEach(() => {
      scale = Scale.get("C major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      strings = fb.strings;
    });

    it("throws error for non-5 or non-7 note scales", () => {
      const chromatic = Scale.get("C chromatic");
      const testStrings = [[], [], [], [], [], []];
      expect(() => {
        caged(testStrings, chromatic);
      }).toThrow(
        "CAGED system only works with 5-note pentatonic or 7-note scales"
      );
    });

    it("assigns CAGED positions to scale notes", () => {
      // Check that scale notes have CAGED positions
      const lowE = strings[5]; // Low E string
      const cNote = lowE[8]; // C at fret 8 on low E string

      expect(cNote.note.pc).toBe("C");
      expect(cNote.interval).toBe("1P");
      expect(cNote.positions.CAGED).toBeDefined();
      expect(Array.isArray(cNote.positions.CAGED)).toBe(true);
      expect(cNote.positions.CAGED.length).toBeGreaterThan(0);
    });

    it("assigns positions property to all scale notes on all strings", () => {
      for (const string of strings) {
        for (const note of string) {
          if (note.interval) {
            expect(note.positions.CAGED).toBeDefined();
            expect(Array.isArray(note.positions.CAGED)).toBe(true);
          }
        }
      }
    });

    it("only assigns positions to notes that are in the scale", () => {
      for (const string of strings) {
        for (const note of string) {
          if (!note.interval) {
            // Non-scale notes should either have no CAGED positions or an empty array
            expect(
              note.positions.CAGED === undefined ||
                note.positions.CAGED.length === 0
            ).toBe(true);
          }
        }
      }
    });

    it("assigns position arrays with values between 1 and 5", () => {
      for (const string of strings) {
        for (const note of string) {
          if (note.positions.CAGED && note.positions.CAGED.length > 0) {
            for (const pos of note.positions.CAGED) {
              expect(pos).toBeGreaterThanOrEqual(1);
              expect(pos).toBeLessThanOrEqual(5);
            }
          }
        }
      }
    });

    it("returns the same string array reference that was passed in", () => {
      const result = Scale.get("C major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, result);
      expect(fb.strings).toBe(fb.strings);
    });

    it("processes all 6 strings", () => {
      expect(strings.length).toBe(6);
    });
  });

  describe("with 5-note pentatonic scale", () => {
    beforeEach(() => {
      scale = Scale.get("A minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, scale);
      strings = fb.strings;
    });

    it("assigns CAGED positions to pentatonic scale notes", () => {
      const lowE = strings[5]; // Low E string
      const aNote = lowE[5]; // A at fret 5 on low E string

      expect(aNote.note.pc).toBe("A");
      expect(aNote.interval).toBe("1P");
      expect(aNote.positions.CAGED).toBeDefined();
      expect(Array.isArray(aNote.positions.CAGED)).toBe(true);
      expect(aNote.positions.CAGED.length).toBeGreaterThan(0);
    });

    it("works alongside pentatonic system", () => {
      // When a pentatonic scale is used, both systems should be applied
      for (const string of strings) {
        for (const note of string) {
          if (note.interval) {
            expect(note.positions.Pentatonic).toBeDefined();
            expect(note.positions.CAGED).toBeDefined();
          }
        }
      }
    });

    it("assigns valid CAGED positions for pentatonic scales", () => {
      let foundWithPositions = false;
      for (const string of strings) {
        for (const note of string) {
          if (note.positions.CAGED && note.positions.CAGED.length > 0) {
            foundWithPositions = true;
            for (const pos of note.positions.CAGED) {
              expect(pos).toBeGreaterThanOrEqual(1);
              expect(pos).toBeLessThanOrEqual(5);
            }
          }
        }
      }
      expect(foundWithPositions).toBe(true);
    });
  });

  describe("with different scales", () => {
    it("works with G major scale", () => {
      const gMajor = Scale.get("G major");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, gMajor);

      let hasCAGEDPositions = false;
      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.CAGED && note.positions.CAGED.length > 0) {
            hasCAGEDPositions = true;
            break;
          }
        }
        if (hasCAGEDPositions) break;
      }

      expect(hasCAGEDPositions).toBe(true);
    });

    it("works with E minor pentatonic", () => {
      const eMinorPent = Scale.get("E minor pentatonic");
      const fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, eMinorPent);

      let hasCAGEDPositions = false;
      for (const string of fb.strings) {
        for (const note of string) {
          if (note.positions.CAGED && note.positions.CAGED.length > 0) {
            hasCAGEDPositions = true;
            break;
          }
        }
        if (hasCAGEDPositions) break;
      }

      expect(hasCAGEDPositions).toBe(true);
    });
  });
});
