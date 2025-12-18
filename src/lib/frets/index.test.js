import { describe, it, expect } from "vitest";
import { frets } from "./";

describe("fretboard tests", () => {
  describe("initialization", () => {
    it("initializes with standard tuning by default", () => {
      const fb = frets();
      expect(fb.tuning()).toEqual(["E2", "A2", "D3", "G3", "B3", "E4"]);
      expect(fb.count()).toBe(12);
    });

    it("initializes with custom tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      expect(fb.tuning()).toEqual(dropD);
    });

    it("initializes with custom fret count", () => {
      const fb = frets(undefined, 24);
      expect(fb.count()).toBe(24);
    });

    it("returns a function object with required methods", () => {
      const fb = frets();
      expect(typeof fb).toBe("function");
      expect(typeof fb.notes).toBe("function");
      expect(typeof fb.tuning).toBe("function");
      expect(typeof fb.count).toBe("function");
    });
  });

  describe("notes generation", () => {
    it("creates notes for all strings and frets", () => {
      const fb = frets();
      const notes = fb.notes();
      expect(Array.isArray(notes)).toBe(true);
      expect(notes.length).toBe(6);
      expect(notes[0].length).toBe(13);
    });

    it("generates correct number of notes based on fret count", () => {
      const fb = frets(undefined, 24);
      const notes = fb.notes();
      expect(notes[0].length).toBe(25);
    });

    it("generates correct start notes for each string", () => {
      const fb = frets();
      const notes = fb.notes();

      fb.tuning().forEach((tuningNote, i) => {
        expect(notes[i][0].note.name).toBe(tuningNote);
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
        expect(currMidi - prevMidi).toBe(1);
      }
    });

    it("generates notes with correct properties", () => {
      const fb = frets();
      const notes = fb.notes();
      const firstNote = notes[0][0];

      expect(firstNote).toHaveProperty("note");
      expect(firstNote).toHaveProperty("string");
      expect(firstNote).toHaveProperty("fret");

      // Check note object properties
      expect(firstNote.note).toHaveProperty("name");
      expect(firstNote.note).toHaveProperty("chroma");
      expect(firstNote.note).toHaveProperty("oct");
      expect(firstNote.note).toHaveProperty("letter");
      expect(firstNote.note).toHaveProperty("midi");
      expect(firstNote.note).toHaveProperty("freq");
      expect(firstNote.note).toHaveProperty("pc");
    });

    it("generates correct string and fret indices", () => {
      const fb = frets();
      const notes = fb.notes();

      notes.forEach((string, stringIndex) => {
        string.forEach((noteObj, fretIndex) => {
          expect(noteObj.string).toBe(stringIndex);
          expect(noteObj.fret).toBe(fretIndex);
        });
      });
    });

    it("generates all 6 strings for standard tuning", () => {
      const fb = frets();
      const notes = fb.notes();

      expect(notes.length).toBe(6);
      expect(notes[0][0].note.name).toBe("E2");
      expect(notes[1][0].note.name).toBe("A2");
      expect(notes[2][0].note.name).toBe("D3");
      expect(notes[3][0].note.name).toBe("G3");
      expect(notes[4][0].note.name).toBe("B3");
      expect(notes[5][0].note.name).toBe("E4");
    });

    it("generates correct notes at specific fret positions", () => {
      const fb = frets();
      const notes = fb.notes();

      // Test known notes on the low E string
      expect(notes[0][0].note.name).toBe("E2");
      expect(notes[0][5].note.name).toBe("A2");
      expect(notes[0][12].note.name).toBe("E3");
    });
  });

  describe("alternative tunings", () => {
    it("works with drop D tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      const notes = fb.notes();

      expect(notes[0][0].note.name).toBe("D2");
      expect(notes.length).toBe(6);
    });

    it("works with DADGAD tuning", () => {
      const dadgad = ["D2", "A2", "D3", "G3", "A3", "D4"];
      const fb = frets(dadgad);
      const notes = fb.notes();

      expect(notes[0][0].note.name).toBe("D2");
      expect(notes[4][0].note.name).toBe("A3");
      expect(notes[5][0].note.name).toBe("D4");
    });

    it("works with 7-string tuning", () => {
      const sevenString = ["B1", "E2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(sevenString);
      const notes = fb.notes();

      expect(notes.length).toBe(7);
      expect(notes[0][0].note.name).toBe("B1");
    });

    it("works with 4-string bass tuning", () => {
      const bass = ["E1", "A1", "D2", "G2"];
      const fb = frets(bass);
      const notes = fb.notes();

      expect(notes.length).toBe(4);
      expect(notes[0][0].note.name).toBe("E1");
      expect(notes[3][0].note.name).toBe("G2");
    });
  });

  describe("edge cases", () => {
    it("handles single fret count", () => {
      const fb = frets(undefined, 1);
      const notes = fb.notes();

      expect(fb.count()).toBe(1);
      expect(notes[0].length).toBe(2);
    });

    it("handles large fret count", () => {
      const fb = frets(undefined, 36);
      const notes = fb.notes();

      expect(fb.count()).toBe(36);
      expect(notes[0].length).toBe(37);
    });

    it("handles zero fret count", () => {
      const fb = frets(undefined, 0);
      const notes = fb.notes();

      expect(fb.count()).toBe(0);
      expect(notes[0].length).toBe(1);
    });
  });
});
