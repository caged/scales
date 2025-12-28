import { describe, it, expect } from "vitest";
import { Scale } from "tonal";
import frets from "./index.js";

describe("fretboard tests", () => {
  describe("initialization", () => {
    it("initializes with standard tuning by default", () => {
      const fb = frets();
      expect(fb.tuning).toEqual(["E2", "A2", "D3", "G3", "B3", "E4"]);
      expect(fb.count).toBe(13);
    });

    it("initializes with custom tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      expect(fb.tuning).toEqual(dropD);
    });

    it("initializes with custom fret count", () => {
      const fb = frets(undefined, 24);
      expect(fb.count).toBe(24);
    });

    it("returns a function object with required properties", () => {
      const fb = frets();
      expect(typeof fb).toBe("function");
      expect(Array.isArray(fb.strings)).toBe(true);
      expect(Array.isArray(fb.tuning)).toBe(true);
      expect(typeof fb.count).toBe("number");
    });
  });

  describe("notes generation", () => {
    it("creates notes for all strings and frets", () => {
      const fb = frets();
      const notes = fb.strings;
      expect(Array.isArray(notes)).toBe(true);
      expect(notes.length).toBe(6);
      expect(notes[0].length).toBe(13);
    });

    it("generates correct number of notes based on fret count", () => {
      const fb = frets(undefined, 24);
      const notes = fb.strings;
      expect(notes[0].length).toBe(24);
    });

    it("generates correct start notes for each string (reversed by default)", () => {
      const fb = frets();
      const notes = fb.strings;

      // Strings are reversed by default: [E4, B3, G3, D3, A2, E2]
      const reversedTuning = [...fb.tuning].reverse();
      reversedTuning.forEach((tuningNote, i) => {
        expect(notes[i][0].note.name).toBe(tuningNote);
      });
    });

    it("generates chromatic progression for each string", () => {
      const fb = frets();
      const notes = fb.strings;
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
      const notes = fb.strings;
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
      const notes = fb.strings;

      notes.forEach((string, stringIndex) => {
        string.forEach((noteObj, fretIndex) => {
          expect(noteObj.string).toBe(stringIndex);
          expect(noteObj.fret).toBe(fretIndex);
        });
      });
    });

    it("generates all 6 strings for standard tuning (reversed)", () => {
      const fb = frets();
      const notes = fb.strings;

      // Strings are reversed: index 0 = high E, index 5 = low E
      expect(notes.length).toBe(6);
      expect(notes[0][0].note.name).toBe("E4"); // High E
      expect(notes[1][0].note.name).toBe("B3");
      expect(notes[2][0].note.name).toBe("G3");
      expect(notes[3][0].note.name).toBe("D3");
      expect(notes[4][0].note.name).toBe("A2");
      expect(notes[5][0].note.name).toBe("E2"); // Low E
    });

    it("generates correct notes at specific fret positions", () => {
      const fb = frets();
      const notes = fb.strings;
      const lowE = notes[5]; // Low E is at index 5 (reversed)

      // Test known notes on the low E string
      expect(lowE[0].note.name).toBe("E2");
      expect(lowE[5].note.name).toBe("A2");
      expect(lowE[12].note.name).toBe("E3");
    });
  });

  describe("alternative tunings", () => {
    it("works with drop D tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      const notes = fb.strings;
      const lowString = notes[5]; // Reversed, so low string is at index 5

      expect(lowString[0].note.name).toBe("D2");
      expect(notes.length).toBe(6);
    });

    it("works with DADGAD tuning", () => {
      const dadgad = ["D2", "A2", "D3", "G3", "A3", "D4"];
      const fb = frets(dadgad);
      const notes = fb.strings;

      // Reversed order
      expect(notes[5][0].note.name).toBe("D2"); // Low D
      expect(notes[1][0].note.name).toBe("A3");
      expect(notes[0][0].note.name).toBe("D4"); // High D
    });

    it("works with 7-string tuning", () => {
      const sevenString = ["B1", "E2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(sevenString);
      const notes = fb.strings;

      expect(notes.length).toBe(7);
      expect(notes[6][0].note.name).toBe("B1"); // Reversed, lowest is at end
    });

    it("works with 4-string bass tuning", () => {
      const bass = ["E1", "A1", "D2", "G2"];
      const fb = frets(bass);
      const notes = fb.strings;

      expect(notes.length).toBe(4);
      expect(notes[3][0].note.name).toBe("E1"); // Low E at end (reversed)
      expect(notes[0][0].note.name).toBe("G2"); // High G at start
    });
  });

  describe("edge cases", () => {
    it("handles single fret count", () => {
      const fb = frets(undefined, 1);
      const notes = fb.strings;

      expect(fb.count).toBe(1);
      expect(notes[0].length).toBe(1);
    });

    it("handles large fret count", () => {
      const fb = frets(undefined, 36);
      const notes = fb.strings;

      expect(fb.count).toBe(36);
      expect(notes[0].length).toBe(36);
    });

    it("handles zero fret count", () => {
      const fb = frets(undefined, 0);
      const notes = fb.strings;

      expect(fb.count).toBe(0);
      expect(notes[0].length).toBe(0);
    });
  });

  describe("note normalization for scales", () => {
    it("normalizes to flats for Ab major scale", () => {
      const scale = Scale.get("Ab major");
      const fb = frets(undefined, 13, scale);
      const notes = fb.strings;
      const lowE = notes[5]; // Low E string (reversed)

      // On the low E string, fret 4 is G#/Ab - should be Ab for Ab major
      expect(lowE[4].label).toBe("A♭");
    });

    it("shows all flat notes in Ab major scale intervals", () => {
      const scale = Scale.get("Ab major");
      const fb = frets(undefined, 13, scale);
      const notes = fb.strings;

      // Collect all notes that are part of the Ab major scale (have intervals)
      const scaleNotes = notes.flat().filter((n) => n.interval !== null);
      const scaleLabels = [...new Set(scaleNotes.map((n) => n.label))];

      // Ab major should be: Ab, Bb, C, Db, Eb, F, G (with ♭ symbols)
      expect(scaleLabels.sort()).toEqual(["A♭", "B♭", "C", "D♭", "E♭", "F", "G"]);
    });

    it("does not normalize sharps for G# major scale", () => {
      const scale = Scale.get("G# major");
      const fb = frets(undefined, 13, scale);
      const notes = fb.strings;

      // G# major scale uses sharps
      const scaleNotes = notes.flat().filter((n) => n.interval !== null);
      const scaleLabels = [...new Set(scaleNotes.map((n) => n.label))];

      // Should contain sharps
      expect(scaleLabels).toContain("G♯");
      expect(scaleLabels).toContain("A♯");
      expect(scaleLabels).toContain("C♯");
      expect(scaleLabels).toContain("D♯");
    });

    it("uses scale note names for notes in the scale", () => {
      const scale = Scale.get("Ab major");
      const fb = frets(undefined, 13, scale);
      const notes = fb.strings;

      // Notes that are in the Ab major scale should use the scale's notation
      const scaleNotes = notes.flat().filter((n) => n.interval !== null);
      const scaleLabels = [...new Set(scaleNotes.map((n) => n.label))];

      // Scale notes should all be flats or naturals (no sharps in Ab major)
      const scaleHasSharps = scaleLabels.some((label) => label.includes("♯"));
      expect(scaleHasSharps).toBe(false);
      expect(scaleLabels.sort()).toEqual(["A♭", "B♭", "C", "D♭", "E♭", "F", "G"]);
    });

    it("uses scale note names including Cb for Gb major", () => {
      const scale = Scale.get("Gb major");
      const fb = frets(undefined, 13, scale);
      const notes = fb.strings;

      // Gb major scale contains Cb
      const scaleNotes = notes.flat().filter((n) => n.interval !== null);
      const scaleLabels = [...new Set(scaleNotes.map((n) => n.label))];

      // Should have C♭ as defined in the scale
      expect(scaleLabels).toContain("C♭");
      expect(scaleLabels.sort()).toEqual(["A♭", "B♭", "C♭", "D♭", "E♭", "F", "G♭"]);

      // All notes should be flats or naturals (no sharps)
      const hasSharps = scaleLabels.some((label) => label.includes("♯"));
      expect(hasSharps).toBe(false);
    });
  });
});
