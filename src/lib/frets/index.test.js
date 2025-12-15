import { Note, Range } from "tonal";
import { frets, tnps, pentatonic, scale } from "./";
import { assert } from "chai";

describe("fretboard tests", () => {
  describe("initialization", () => {
    it("initializes with standard tuning by default", () => {
      const fb = frets();
      assert.deepEqual(fb.tuning(), ["E2", "A2", "D3", "G3", "B3", "E4"]);
      assert.equal(fb.count(), 24);
      assert.equal(fb.octaves(), 2);
    });

    it("initializes with custom tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      assert.deepEqual(fb.tuning(), dropD);
    });

    it("initializes with custom octave count", () => {
      const fb = frets(undefined, 3);
      assert.equal(fb.octaves(), 3);
      assert.equal(fb.count(), 36);
    });

    it("initializes with sharps instead of flats", () => {
      const fb = frets(undefined, 2, true);
      const notes = fb.notes();
      const firstString = notes[0];
      const noteNames = firstString.map((n) => n.name);

      const hasSharp = noteNames.some((name) => name.includes("#"));
      const hasFlat = noteNames.some((name) => name.includes("b"));

      assert.isTrue(hasSharp, "Should contain sharp notes");
      assert.isFalse(hasFlat, "Should not contain flat notes");
    });

    it("returns a function object", () => {
      const fb = frets();
      assert.isFunction(fb);
      assert.isFunction(fb.notes);
      assert.isFunction(fb.tuning);
      assert.isFunction(fb.count);
      assert.isFunction(fb.octaves);
      assert.isFunction(fb.system);
      assert.isFunction(fb.scale);
    });
  });

  describe("notes generation", () => {
    it("creates two octaves of notes data by default", () => {
      const fb = frets();
      const notes = fb.notes();
      assert.isArray(notes);
      assert.equal(notes.length, 6, "Should have 6 strings");
      assert.equal(notes[0].length, 25, "Each string should have 25 notes (2 octaves + 1)");
    });

    it("always creates 2 octaves of notes regardless of octaves parameter", () => {
      const fb = frets(undefined, 3);
      const notes = fb.notes();
      assert.equal(
        notes[0].length,
        25,
        "Notes are always 2 octaves (hardcoded), octaves param only affects count()"
      );
      assert.equal(fb.count(), 36, "count() reflects the octaves parameter");
    });

    it("generates correct start and end notes for each string", () => {
      const fb = frets();
      const notes = fb.notes();

      fb.tuning().forEach((note, i) => {
        const { letter, oct } = Note.get(note);
        assert.equal(notes[i][0].name, note, `String ${i} should start with ${note}`);
        assert.equal(
          notes[i][notes[i].length - 1].name,
          `${letter}${oct + 2}`,
          `String ${i} should end 2 octaves higher`
        );
      });
    });

    it("creates chromatic range of notes for each string", () => {
      const fb = frets();
      const strings = fb.notes();
      const e = strings[0];
      const enames = e.map((n) => n.name);

      assert.deepEqual(enames, Range.chromatic(["E2", "E4"]));
    });

    it("creates independent note objects (not cached references)", () => {
      const fb = frets();
      const notes = fb.notes();
      const firstE = notes[0][0];
      const lastE = notes[5][0];

      firstE.customProperty = "test";
      assert.isUndefined(lastE.customProperty, "Note objects should be independent");
    });

    it("generates notes with correct note properties", () => {
      const fb = frets();
      const notes = fb.notes();
      const firstNote = notes[0][0];

      assert.property(firstNote, "name");
      assert.property(firstNote, "chroma");
      assert.property(firstNote, "oct");
      assert.property(firstNote, "letter");
      assert.property(firstNote, "midi");
      assert.property(firstNote, "freq");
      assert.property(firstNote, "pc");
    });

    it("generates all 6 strings for standard tuning", () => {
      const fb = frets();
      const notes = fb.notes();

      assert.equal(notes.length, 6);
      assert.equal(notes[0][0].name, "E2");
      assert.equal(notes[1][0].name, "A2");
      assert.equal(notes[2][0].name, "D3");
      assert.equal(notes[3][0].name, "G3");
      assert.equal(notes[4][0].name, "B3");
      assert.equal(notes[5][0].name, "E4");
    });
  });

  describe("system management", () => {
    it("sets and gets a system", () => {
      const fb = frets().system(tnps);
      assert.deepEqual(fb.system(), tnps);
      assert.isFunction(fb.system());
    });

    it("supports method chaining for system", () => {
      const fb = frets();
      const result = fb.system(tnps);
      assert.strictEqual(result, fb, "Should return the fretboard for chaining");
    });

    it("sets pentatonic system", () => {
      const fb = frets().system(pentatonic);
      assert.deepEqual(fb.system(), pentatonic);
    });

    it("returns undefined when no system is set", () => {
      const fb = frets();
      assert.isUndefined(fb.system());
    });
  });

  describe("scale management", () => {
    it("sets and gets a scale", () => {
      const dMinor = scale("D minor");
      const fb = frets().scale(dMinor);
      assert.deepEqual(fb.scale(), dMinor);
    });

    it("supports method chaining for scale", () => {
      const fb = frets();
      const result = fb.scale(scale("A major"));
      assert.strictEqual(result, fb, "Should return the fretboard for chaining");
    });

    it("returns undefined when no scale is set", () => {
      const fb = frets();
      assert.isUndefined(fb.scale());
    });
  });

  describe("alternative tunings", () => {
    it("works with drop D tuning", () => {
      const dropD = ["D2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(dropD);
      const notes = fb.notes();

      assert.equal(notes[0][0].name, "D2");
      assert.equal(notes.length, 6);
    });

    it("works with DADGAD tuning", () => {
      const dadgad = ["D2", "A2", "D3", "G3", "A3", "D4"];
      const fb = frets(dadgad);
      const notes = fb.notes();

      assert.equal(notes[0][0].name, "D2");
      assert.equal(notes[4][0].name, "A3");
      assert.equal(notes[5][0].name, "D4");
    });

    it("works with 7-string tuning", () => {
      const sevenString = ["B1", "E2", "A2", "D3", "G3", "B3", "E4"];
      const fb = frets(sevenString);
      const notes = fb.notes();

      assert.equal(notes.length, 7);
      assert.equal(notes[0][0].name, "B1");
    });
  });

  describe("edge cases", () => {
    it("handles single octave parameter", () => {
      const fb = frets(undefined, 1);
      const notes = fb.notes();

      assert.equal(fb.octaves(), 1);
      assert.equal(fb.count(), 12);
      assert.equal(
        notes[0].length,
        25,
        "Notes are always 2 octaves regardless of octaves param"
      );
    });

    it("handles large octave parameter", () => {
      const fb = frets(undefined, 5);
      const notes = fb.notes();

      assert.equal(fb.octaves(), 5);
      assert.equal(fb.count(), 60);
      assert.equal(
        notes[0].length,
        25,
        "Notes are always 2 octaves regardless of octaves param"
      );
    });
  });
});
