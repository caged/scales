import { convertToSVGuitarFormat, getChordFingerings, getChordVariations } from "./chordFingerings.js";

import { assert } from "chai";

describe("chordFingerings tests", () => {
  describe("getChordFingerings", () => {
    it("should get fingerings for Amin7", () => {
      const fingerings = getChordFingerings("Amin7");
      assert.isNotNull(fingerings);
      assert.isArray(fingerings);
      assert.isAbove(fingerings.length, 0);
      assert.property(fingerings[0], "frets");
      assert.property(fingerings[0], "fingers");
    });

    it("should get fingerings for C major", () => {
      const fingerings = getChordFingerings("C");
      assert.isNotNull(fingerings);
      assert.isArray(fingerings);
      assert.isAbove(fingerings.length, 0);
    });

    it("should get fingerings for Cmaj", () => {
      const fingerings = getChordFingerings("Cmaj");
      assert.isNotNull(fingerings);
      assert.isArray(fingerings);
    });

    it("should get fingerings for G7", () => {
      const fingerings = getChordFingerings("G7");
      assert.isNotNull(fingerings);
      assert.isArray(fingerings);
      assert.isAbove(fingerings.length, 0);
    });

    it("should get fingerings for Dmaj7", () => {
      const fingerings = getChordFingerings("Dmaj7");
      assert.isNotNull(fingerings);
      assert.isArray(fingerings);
      assert.isAbove(fingerings.length, 0);
    });

    it("should handle sharp notes (F#)", () => {
      const fingerings = getChordFingerings("F#");
      assert.isNotNull(fingerings);
      assert.isArray(fingerings);
    });

    it("should handle flat notes (Bb)", () => {
      const fingerings = getChordFingerings("Bb");
      assert.isNotNull(fingerings);
      assert.isArray(fingerings);
    });

    it("should return null for invalid chord", () => {
      const fingerings = getChordFingerings("XYZ123");
      assert.isNull(fingerings);
    });
  });

  describe("convertToSVGuitarFormat", () => {
    it("should convert basic position to svguitar format", () => {
      const position = {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1,
        barres: []
      };

      const result = convertToSVGuitarFormat(position);
      assert.property(result, "fingers");
      assert.property(result, "barres");
      assert.property(result, "position");
      assert.equal(result.position, 1);
      assert.isArray(result.fingers);
      assert.isArray(result.barres);
    });

    it("should handle muted strings correctly", () => {
      const position = {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1
      };

      const result = convertToSVGuitarFormat(position);
      // First string (6th) should be muted
      assert.deepEqual(result.fingers[0], [6, 'x']);
    });

    it("should handle open strings correctly", () => {
      const position = {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1
      };

      const result = convertToSVGuitarFormat(position);
      // Find open strings (fret 0)
      const openStrings = result.fingers.filter(f => f[1] === 0);
      assert.isAbove(openStrings.length, 0);
    });

    it("should convert barre chords correctly", () => {
      const position = {
        frets: [1, 1, 3, 3, 3, 1],
        fingers: [1, 1, 2, 3, 4, 1],
        barres: 1,
        baseFret: 3
      };

      const result = convertToSVGuitarFormat(position);
      assert.isAbove(result.barres.length, 0);
      assert.property(result.barres[0], "fromString");
      assert.property(result.barres[0], "toString");
      assert.property(result.barres[0], "fret");
      assert.equal(result.barres[0].fret, 1);
    });
  });

  describe("getChordVariations", () => {
    it("should return all variations for C major", () => {
      const variations = getChordVariations("C");
      assert.isNotNull(variations);
      assert.isArray(variations);
      assert.isAbove(variations.length, 0);

      // Each variation should be in svguitar format
      variations.forEach(variation => {
        assert.property(variation, "fingers");
        assert.property(variation, "barres");
        assert.property(variation, "position");
      });
    });

    it("should return null for invalid chord", () => {
      const variations = getChordVariations("InvalidChord");
      assert.isNull(variations);
    });

    it("should return multiple variations", () => {
      const variations = getChordVariations("Am");
      assert.isNotNull(variations);
      // Most chords should have multiple fingering options
      assert.isAbove(variations.length, 1);
    });

    it("should return barre chords for F major", () => {
      const variations = getChordVariations("F");
      assert.isNotNull(variations);
      assert.isArray(variations);

      // F major typically has barre chord positions
      const hasBarrePosition = variations.some(v => v.barres.length > 0);
      assert.isTrue(hasBarrePosition, "F major should have at least one barre chord position");

      // Check first position has a barre
      const firstVariation = variations[0];
      assert.isAbove(firstVariation.barres.length, 0);
      assert.property(firstVariation.barres[0], "fromString");
      assert.property(firstVariation.barres[0], "toString");
      assert.property(firstVariation.barres[0], "fret");
      assert.equal(firstVariation.barres[0].fret, 1); 
    });
  });
});
