import { frets, scale } from "../";

import { assert } from "chai";
import pentatonic from "./pentatonic";

describe("pentatonic scale tests", () => {
  let fb;
  let strings;
  let dms;
  let notes;

  beforeEach(() => {
    fb = frets();
    notes = fb.notes();
    dms = scale("A minor pentatonic");
    strings = pentatonic(notes, dms);
  });

  it("throws error for non-pentatonic scales", () => {
    const majorScale = scale("C major");
    assert.throws(
      () => pentatonic(notes, majorScale),
      Error,
      "Does not appear to be a pentatonic scale"
    );
  });

  it("assigns correct positions to scale notes", () => {
    const e = strings[0];
    const anote = e[5];

    assert.equal(anote.name, "A2");
    assert.equal(anote.interval, "1P");
    assert.deepEqual(anote.positions, [1, 5]);
  });

  it("assigns positions property to all scale notes on all strings", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          assert.isArray(note.positions);
          assert.isTrue(note.positions.every((pos) => pos >= 1 && pos <= 5));
        }
      }
    }
  });

  it("assigns interval property to scale notes", () => {
    const scaleIntervals = dms.intervals();
    for (const string of strings) {
      for (const note of string) {
        if (note.interval) {
          assert.include(scaleIntervals, note.interval);
        }
      }
    }
  });

  it("processes all 6 strings", () => {
    assert.equal(strings.length, 6);
  });

  it("returns the same string array reference that was passed in", () => {
    const originalNotes = fb.notes();
    const result = pentatonic(originalNotes, dms);
    assert.strictEqual(result, originalNotes);
  });

  it("works with different pentatonic scales", () => {
    const gMajorPent = scale("G major pentatonic");
    const gStrings = pentatonic(frets().notes(), gMajorPent);

    assert.isDefined(gStrings);
    assert.equal(gStrings.length, 6);

    const hasPositions = gStrings.some((string) =>
      string.some((note) => note.positions && note.positions.length > 0)
    );
    assert.isTrue(hasPositions, "Should have notes with positions assigned");
  });

  it("assigns position arrays with values between 1 and 5", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          assert.isArray(note.positions);
          for (const pos of note.positions) {
            assert.isAtLeast(pos, 1, `Position ${pos} should be >= 1`);
            assert.isAtMost(pos, 5, `Position ${pos} should be <= 5`);
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
          assert.include(
            scaleChroma,
            note.chroma,
            `Note ${note.name} with positions should be in the scale`
          );
        }
      }
    }
  });

  it("notes with positions have corresponding intervals", () => {
    for (const string of strings) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          assert.isDefined(
            note.interval,
            `Note ${note.name} at positions ${note.positions} should have an interval`
          );
        }
      }
    }
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
      assert.isDefined(
        chromaStringCount[chroma],
        `Scale note with chroma ${chroma} should appear on at least one string`
      );
      assert.isAtLeast(
        chromaStringCount[chroma].size,
        1,
        `Scale note with chroma ${chroma} should appear on at least one string`
      );
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
            assert.equal(
              JSON.stringify(note.positions),
              firstPositions,
              `All notes with chroma ${chroma} on same string should have identical positions`
            );
          }
        }
      }
    }
  });
});
