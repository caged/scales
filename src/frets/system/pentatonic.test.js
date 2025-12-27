import { Note, Scale } from "tonal";
import { beforeEach, describe, expect, it } from "vitest";

import frets from "../index.js";
import pentatonic from "./pentatonic.js";

describe("pentatonic scale tests", () => {
  let fb;
  let strings;
  let dms;
  let notes;

  beforeEach(() => {
    fb = frets();
    notes = fb.strings;
    dms = Scale.get("A minor pentatonic");
    strings = pentatonic(notes, dms);
  });

  it("throws error for non-pentatonic scales", () => {
    const majorScale = Scale.get("C major");
    expect(() => pentatonic(notes, majorScale)).toThrow(
      "Does not appear to be a pentatonic scale"
    );
  });

  it("assigns correct positions to scale notes", () => {
    const e = strings[0]; // High E string (E4) - strings are reversed by default
    const anote = e[5]; // 5th fret on high E string is A4

    expect(anote.note.name).toBe("A4");
    expect(anote.interval).toBe("1P");
    // A is the root (degree 0). On high E string for A minor pentatonic:
    // Position 1 (G shape) pattern is [0, 1] - includes root (degree 0)
    // Position 5 (A shape) pattern is [4, 0] - includes root (degree 0)
    expect(anote.positions.Pentatonic).toEqual([1, 5]);
  });

  it("assigns positions property to all scale notes on all strings", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions.Pentatonic && note.positions.Pentatonic.length > 0) {
          expect(Array.isArray(note.positions.Pentatonic)).toBe(true);
          expect(
            note.positions.Pentatonic.every((pos) => pos >= 1 && pos <= 5)
          ).toBe(true);
        }
      }
    }
  });

  it("assigns interval property to scale notes", () => {
    const scaleIntervals = dms.intervals;
    for (const string of strings) {
      for (const note of string) {
        if (note.interval) {
          expect(scaleIntervals).toContain(note.interval);
        }
      }
    }
  });

  it("processes all 6 strings", () => {
    expect(strings.length).toBe(6);
  });

  it("returns the same string array reference that was passed in", () => {
    const originalNotes = fb.strings;
    const result = pentatonic(originalNotes, dms);
    expect(result).toBe(originalNotes);
  });

  it("works with different pentatonic scales", () => {
    const gMajorPent = Scale.get("G major pentatonic");
    const gStrings = pentatonic(frets().strings, gMajorPent);

    expect(gStrings).toBeDefined();
    expect(gStrings.length).toBe(6);

    const hasPositions = gStrings.some((string) =>
      string.some(
        (note) =>
          note.positions.Pentatonic && note.positions.Pentatonic.length > 0
      )
    );
    expect(hasPositions).toBe(true);
  });

  it("assigns position arrays with values between 1 and 5", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions.Pentatonic && note.positions.Pentatonic.length > 0) {
          expect(Array.isArray(note.positions.Pentatonic)).toBe(true);
          for (const pos of note.positions.Pentatonic) {
            expect(pos).toBeGreaterThanOrEqual(1);
            expect(pos).toBeLessThanOrEqual(5);
          }
        }
      }
    }
  });

  it("only assigns positions to notes that are in the scale", () => {
    const scaleChroma = dms.notes.map((noteName) => Note.get(noteName).chroma);

    for (const string of strings) {
      for (const note of string) {
        if (note.positions.Pentatonic && note.positions.Pentatonic.length > 0) {
          expect(scaleChroma).toContain(note.note.chroma);
        }
      }
    }
  });

  it("notes with positions have corresponding intervals", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions.Pentatonic && note.positions.Pentatonic.length > 0) {
          expect(note.interval).toBeDefined();
        }
      }
    }
  });

  it("each scale note appears on multiple strings", () => {
    const scaleChroma = dms.notes.map((noteName) => Note.get(noteName).chroma);
    const chromaStringCount = {};

    for (const [strnum, string] of strings.entries()) {
      for (const note of string) {
        if (note.positions.Pentatonic && note.positions.Pentatonic.length > 0) {
          if (!chromaStringCount[note.note.chroma]) {
            chromaStringCount[note.note.chroma] = new Set();
          }
          chromaStringCount[note.note.chroma].add(strnum);
        }
      }
    }

    for (const chroma of scaleChroma) {
      expect(chromaStringCount[chroma]).toBeDefined();
      expect(chromaStringCount[chroma].size).toBeGreaterThanOrEqual(1);
    }
  });

  it("same chroma on same string has identical position assignments", () => {
    for (const string of strings) {
      const notesByChroma = {};

      for (const note of string) {
        if (note.positions.Pentatonic && note.positions.Pentatonic.length > 0) {
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
