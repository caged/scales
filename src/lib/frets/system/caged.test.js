import caged from "./caged";
import { frets, scale } from "../";
import { assert } from "chai";

describe("CAGED system tests", () => {
  let fb;
  let strings;
  let dms;
  let notes;

  beforeEach(() => {
    fb = frets();
    notes = fb.notes();
    dms = scale("D minor");
    strings = caged(notes, dms);
  });

  it("assigns correct positions to scale notes", () => {
    const e = strings[0];
    const enote = e[0];
    const dnote = e[10];

    assert.equal(enote.name, "E2");
    assert.equal(dnote.name, "D3");
    assert.equal(dnote.interval, "1P");
    assert.isDefined(enote.positions);
    assert.isDefined(dnote.positions);
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

  it("processes all 6 strings", () => {
    assert.equal(strings.length, 6);
  });

  it("returns the same string array reference that was passed in", () => {
    const originalNotes = fb.notes();
    const result = caged(originalNotes, dms);
    assert.strictEqual(result, originalNotes);
  });

  it("works with different scales", () => {
    const aMajor = scale("A major");
    const aStrings = caged(frets().notes(), aMajor);

    assert.isDefined(aStrings);
    assert.equal(aStrings.length, 6);

    const hasPositions = aStrings.some((string) =>
      string.some((note) => note.positions && note.positions.length > 0)
    );
    assert.isTrue(hasPositions, "Should have notes with positions assigned");
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
      assert.isTrue(
        notesWithPositions.has(chroma),
        `All scale notes should appear with positions somewhere on the fretboard`
      );
    }
  });

  it("works with pentatonic scales", () => {
    const aPentatonic = scale("A minor pentatonic");
    const pentatonicStrings = caged(frets().notes(), aPentatonic);

    assert.isDefined(pentatonicStrings);
    assert.equal(pentatonicStrings.length, 6);

    const hasPositions = pentatonicStrings.some((string) =>
      string.some((note) => note.positions && note.positions.length > 0)
    );
    assert.isTrue(hasPositions, "Should have notes with positions assigned");

    // Verify all positions are between 1 and 5
    for (const string of pentatonicStrings) {
      for (const note of string) {
        if (note.positions && note.positions.length > 0) {
          for (const pos of note.positions) {
            assert.isAtLeast(pos, 1);
            assert.isAtMost(pos, 5);
          }
        }
      }
    }
  });
});
