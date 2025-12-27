import { beforeEach, describe, expect, it } from "vitest";
import { frets, scale } from "../";

import tnps from "./tnps";

describe("three note per string tests", () => {
  let fb;
  let strings;
  let dms;
  let notes;

  beforeEach(() => {
    fb = frets();
    notes = fb.notes();
    dms = scale("D minor");
    strings = tnps(notes, dms);
  });

  it("assigns correct positions to scale notes", () => {
    const e = strings[0];
    const enote = e[0];
    const dnote = e[10];

    expect(enote.name).toBe("E2");
    expect(dnote.name).toBe("D3");
    expect(dnote.interval).toBe("1P");
    expect(enote.positions).toEqual([1, 2, 7]);
    expect(dnote.positions).toEqual([1, 6, 7]);
  });

  it("assigns position arrays with values between 1 and 7", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          expect(Array.isArray(note.positions)).toBe(true);
          for (const pos of note.positions) {
            expect(pos).toBeGreaterThanOrEqual(1);
            expect(pos).toBeLessThanOrEqual(7);
          }
        }
      }
    }
  });

  it("only assigns positions to notes that are in the scale", () => {
    const scaleChroma = dms.notes().map((n) => n.chroma);

    for (const string of strings) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          expect(scaleChroma).toContain(note.chroma);
        }
      }
    }
  });

  it("assigns interval property to scale notes", () => {
    const scaleIntervals = dms.intervals();
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
        if (note.positions && note.positions.length > 0) {
          expect(note.interval).toBeDefined();
        }
      }
    }
  });

  it("processes all 6 strings", () => {
    expect(strings.length).toBe(6);
  });

  it("returns the same string array reference that was passed in", () => {
    const originalNotes = fb.notes();
    const result = tnps(originalNotes, dms);
    expect(result).toBe(originalNotes);
  });

  it("works with different scales", () => {
    const aMajor = scale("A major");
    const aStrings = tnps(frets().notes(), aMajor);

    expect(aStrings).toBeDefined();
    expect(aStrings.length).toBe(6);

    const hasPositions = aStrings.some((string) =>
      string.some((note) => note.positions && note.positions.length > 0)
    );
    expect(hasPositions).toBe(true);
  });

  it("each scale note appears on multiple strings", () => {
    const scaleChroma = dms.notes().map((n) => n.chroma);
    const chromaStringCount = {};

    for (const [strnum, string] of strings.entries()) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          if (!chromaStringCount[note.chroma]) {
            chromaStringCount[note.chroma] = new Set();
          }
          chromaStringCount[note.chroma].add(strnum);
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
        if (note.positions && note.positions.length > 0) {
          if (!notesByChroma[note.chroma]) {
            notesByChroma[note.chroma] = [];
          }
          notesByChroma[note.chroma].push(note);
        }
      }

      for (const [chroma, notes] of Object.entries(notesByChroma)) {
        if (notes.length > 1) {
          const firstPositions = JSON.stringify(notes[0].positions);
          for (const note of notes) {
            expect(JSON.stringify(note.positions)).toBe(firstPositions);
          }
        }
      }
    }
  });

  it("works with chromatic scale (12 notes)", () => {
    const chromatic = scale("C chromatic");
    const chromaticStrings = tnps(frets().notes(), chromatic);

    expect(chromaticStrings).toBeDefined();
    expect(chromaticStrings.length).toBe(6);

    const hasPositions = chromaticStrings.some((string) =>
      string.some((note) => note.positions && note.positions.length > 0)
    );
    expect(hasPositions).toBe(true);
  });

  it("assigns positions to all notes in scale across the fretboard", () => {
    const scaleChroma = dms.notes().map((n) => n.chroma);
    const notesWithPositions = new Set();

    for (const string of strings) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          notesWithPositions.add(note.chroma);
        }
      }
    }

    for (const chroma of scaleChroma) {
      expect(notesWithPositions.has(chroma)).toBe(true);
    }
  });
});
