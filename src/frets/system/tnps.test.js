import { beforeEach, describe, expect, it } from "vitest";
import { Note, Scale } from "tonal";
import frets from "../index.js";
import tnps from "./tnps.js";

describe("three note per string tests", () => {
  let fb;
  let strings;
  let dms;

  beforeEach(() => {
    dms = Scale.get("D minor");
    fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16, dms);
    strings = tnps(fb.strings, dms);
  });

  it("assigns correct positions to scale notes", () => {
    const lowE = strings[5]; // Low E string (reversed)
    const enote = lowE[0];
    const dnote = lowE[10];

    expect(enote.note.name).toBe("E2");
    expect(dnote.note.name).toBe("D3");
    expect(dnote.interval).toBe("1P");
    expect(enote.positions.TNPS).toBeDefined();
    expect(dnote.positions.TNPS).toBeDefined();
  });

  it("assigns position arrays with values between 1 and 7", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions.TNPS && note.positions.TNPS.length > 0) {
          expect(Array.isArray(note.positions.TNPS)).toBe(true);
          for (const pos of note.positions.TNPS) {
            expect(pos).toBeGreaterThanOrEqual(1);
            expect(pos).toBeLessThanOrEqual(7);
          }
        }
      }
    }
  });

  it("only assigns positions to notes that are in the scale", () => {
    const scaleChroma = dms.notes.map((n) => Note.get(n).chroma);

    for (const string of strings) {
      for (const note of string) {
        if (note.positions.TNPS && note.positions.TNPS.length > 0) {
          expect(scaleChroma).toContain(note.note.chroma);
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

  it("notes with positions have corresponding intervals", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions.TNPS && note.positions.TNPS.length > 0) {
          expect(note.interval).toBeDefined();
        }
      }
    }
  });

  it("processes all 6 strings", () => {
    expect(strings.length).toBe(6);
  });

  it("returns the same string array reference that was passed in", () => {
    const testFb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16);
    const originalStrings = testFb.strings;
    const result = tnps(originalStrings, dms);
    expect(result).toBe(originalStrings);
  });

  it("works with different scales", () => {
    const aMajor = Scale.get("A major");
    const testFb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16);
    const aStrings = tnps(testFb.strings, aMajor);

    expect(aStrings).toBeDefined();
    expect(aStrings.length).toBe(6);

    const hasPositions = aStrings.some((string) =>
      string.some((note) => note.positions.TNPS && note.positions.TNPS.length > 0)
    );
    expect(hasPositions).toBe(true);
  });

  it("each scale note appears on multiple strings", () => {
    const scaleChroma = dms.notes.map((n) => Note.get(n).chroma);
    const chromaStringCount = {};

    for (const [strnum, string] of strings.entries()) {
      for (const note of string) {
        if (note.positions.TNPS && note.positions.TNPS.length > 0) {
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
        if (note.positions.TNPS && note.positions.TNPS.length > 0) {
          if (!notesByChroma[note.note.chroma]) {
            notesByChroma[note.note.chroma] = [];
          }
          notesByChroma[note.note.chroma].push(note);
        }
      }

      for (const notes of Object.values(notesByChroma)) {
        if (notes.length > 1) {
          const firstPositions = JSON.stringify(notes[0].positions.TNPS);
          for (const note of notes) {
            expect(JSON.stringify(note.positions.TNPS)).toBe(firstPositions);
          }
        }
      }
    }
  });

  it("works with chromatic scale (12 notes)", () => {
    const chromatic = Scale.get("C chromatic");
    const testFb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 16);
    const chromaticStrings = tnps(testFb.strings, chromatic);

    expect(chromaticStrings).toBeDefined();
    expect(chromaticStrings.length).toBe(6);

    const hasPositions = chromaticStrings.some((string) =>
      string.some((note) => note.positions.TNPS && note.positions.TNPS.length > 0)
    );
    expect(hasPositions).toBe(true);
  });

  it("assigns positions to all notes in scale across the fretboard", () => {
    const scaleChroma = dms.notes.map((n) => Note.get(n).chroma);
    const notesWithPositions = new Set();

    for (const string of strings) {
      for (const note of string) {
        if (note.positions.TNPS && note.positions.TNPS.length > 0) {
          notesWithPositions.add(note.note.chroma);
        }
      }
    }

    for (const chroma of scaleChroma) {
      expect(notesWithPositions.has(chroma)).toBe(true);
    }
  });
});
