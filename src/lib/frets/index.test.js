import { frets } from "./";
import { assert } from "chai";

describe("fretboard tests", () => {
  describe("initialization", () => {
    it("initializes with standard tuning by default", () => {
      const fb = frets();
      assert.deepEqual(fb.tuning(), ["E2", "A2", "D3", "G3", "B3", "E4"]);
      assert.equal(fb.count(), 12);
    });

    it("initializes with custom tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      assert.deepEqual(fb.tuning(), dropD);
    });

    it("initializes with custom fret count", () => {
      const fb = frets(undefined, 24);
      assert.equal(fb.count(), 24);
    });

    it("returns a function object with required methods", () => {
      const fb = frets();
      assert.isFunction(fb);
      assert.isFunction(fb.notes);
      assert.isFunction(fb.tuning);
      assert.isFunction(fb.count);
    });
  });

  describe("notes generation", () => {
    it("creates notes for all strings and frets", () => {
      const fb = frets();
      const notes = fb.notes();
      assert.isArray(notes);
      assert.equal(notes.length, 6, "Should have 6 strings");
      assert.equal(notes[0].length, 13, "Each string should have 13 notes (frets 0-12)");
    });

    it("generates correct number of notes based on fret count", () => {
      const fb = frets(undefined, 24);
      const notes = fb.notes();
      assert.equal(notes[0].length, 25, "Each string should have 25 notes (frets 0-24)");
    });

    it("generates correct start notes for each string", () => {
      const fb = frets();
      const notes = fb.notes();

      fb.tuning().forEach((tuningNote, i) => {
        assert.equal(
          notes[i][0].note.name,
          tuningNote,
          `String ${i} should start with ${tuningNote}`
        );
      });
    });

    it("generates chromatic progression for each string", () => {
      const fb = frets();
      const notes = fb.notes();
      const firstString = notes[0];

      // Check that each fret is one semitone higher than the previous
      for (let i = 1; i < firstString.length; i++) {
        const prevMidi = firstString[i - 1].note.midi;
        const currMidi = firstString[i].note.midi;
        assert.equal(currMidi - prevMidi, 1, `Fret ${i} should be 1 semitone higher than fret ${i - 1}`);
      }
    });

    it("generates notes with correct properties", () => {
      const fb = frets();
      const notes = fb.notes();
      const firstNote = notes[0][0];

      assert.property(firstNote, "note", "Should have note property");
      assert.property(firstNote, "string", "Should have string property");
      assert.property(firstNote, "fret", "Should have fret property");

      // Check note object properties
      assert.property(firstNote.note, "name");
      assert.property(firstNote.note, "chroma");
      assert.property(firstNote.note, "oct");
      assert.property(firstNote.note, "letter");
      assert.property(firstNote.note, "midi");
      assert.property(firstNote.note, "freq");
      assert.property(firstNote.note, "pc");
    });

    it("generates correct string and fret indices", () => {
      const fb = frets();
      const notes = fb.notes();

      notes.forEach((string, stringIndex) => {
        string.forEach((noteObj, fretIndex) => {
          assert.equal(noteObj.string, stringIndex, `Note should have correct string index`);
          assert.equal(noteObj.fret, fretIndex, `Note should have correct fret index`);
        });
      });
    });

    it("generates all 6 strings for standard tuning", () => {
      const fb = frets();
      const notes = fb.notes();

      assert.equal(notes.length, 6);
      assert.equal(notes[0][0].note.name, "E2");
      assert.equal(notes[1][0].note.name, "A2");
      assert.equal(notes[2][0].note.name, "D3");
      assert.equal(notes[3][0].note.name, "G3");
      assert.equal(notes[4][0].note.name, "B3");
      assert.equal(notes[5][0].note.name, "E4");
    });

    it("generates correct notes at specific fret positions", () => {
      const fb = frets();
      const notes = fb.notes();

      // Test known notes on the low E string
      assert.equal(notes[0][0].note.name, "E2", "Fret 0 should be E2");
      assert.equal(notes[0][5].note.name, "A2", "Fret 5 should be A2");
      assert.equal(notes[0][12].note.name, "E3", "Fret 12 should be E3 (one octave higher)");
    });
  });

  describe("alternative tunings", () => {
    it("works with drop D tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      const notes = fb.notes();

      assert.equal(notes[0][0].note.name, "D2");
      assert.equal(notes.length, 6);
    });

    it("works with DADGAD tuning", () => {
      const dadgad = ["D2", "A2", "D3", "G3", "A3", "D4"];
      const fb = frets(dadgad);
      const notes = fb.notes();

      assert.equal(notes[0][0].note.name, "D2");
      assert.equal(notes[4][0].note.name, "A3");
      assert.equal(notes[5][0].note.name, "D4");
    });

    it("works with 7-string tuning", () => {
      const sevenString = ["B1", "E2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(sevenString);
      const notes = fb.notes();

      assert.equal(notes.length, 7);
      assert.equal(notes[0][0].note.name, "B1");
    });

    it("works with 4-string bass tuning", () => {
      const bass = ["E1", "A1", "D2", "G2"];
      const fb = frets(bass);
      const notes = fb.notes();

      assert.equal(notes.length, 4);
      assert.equal(notes[0][0].note.name, "E1");
      assert.equal(notes[3][0].note.name, "G2");
    });
  });

  describe("edge cases", () => {
    it("handles single fret count", () => {
      const fb = frets(undefined, 1);
      const notes = fb.notes();

      assert.equal(fb.count(), 1);
      assert.equal(notes[0].length, 2, "Should have 2 notes (frets 0-1)");
    });

    it("handles large fret count", () => {
      const fb = frets(undefined, 36);
      const notes = fb.notes();

      assert.equal(fb.count(), 36);
      assert.equal(notes[0].length, 37, "Should have 37 notes (frets 0-36)");
    });

    it("handles zero fret count", () => {
      const fb = frets(undefined, 0);
      const notes = fb.notes();

      assert.equal(fb.count(), 0);
      assert.equal(notes[0].length, 1, "Should have 1 note (fret 0 only)");
    });
  });
});
