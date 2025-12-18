import { describe, it, expect } from "vitest";
import { convertToSVGuitarFormat, getChordFingerings, getChordVariations } from "./chordFingerings.js";

describe("chordFingerings tests", () => {
  describe("getChordFingerings", () => {
    it("should get fingerings for Amin7", () => {
      const fingerings = getChordFingerings("Amin7");
      expect(fingerings).not.toBeNull();
      expect(Array.isArray(fingerings)).toBe(true);
      expect(fingerings.length).toBeGreaterThan(0);
      expect(fingerings[0]).toHaveProperty("frets");
      expect(fingerings[0]).toHaveProperty("fingers");
    });

    it("should get fingerings for C major", () => {
      const fingerings = getChordFingerings("C");
      expect(fingerings).not.toBeNull();
      expect(Array.isArray(fingerings)).toBe(true);
      expect(fingerings.length).toBeGreaterThan(0);
    });

    it("should get fingerings for Cmaj", () => {
      const fingerings = getChordFingerings("Cmaj");
      expect(fingerings).not.toBeNull();
      expect(Array.isArray(fingerings)).toBe(true);
    });

    it("should get fingerings for G7", () => {
      const fingerings = getChordFingerings("G7");
      expect(fingerings).not.toBeNull();
      expect(Array.isArray(fingerings)).toBe(true);
      expect(fingerings.length).toBeGreaterThan(0);
    });

    it("should get fingerings for Dmaj7", () => {
      const fingerings = getChordFingerings("Dmaj7");
      expect(fingerings).not.toBeNull();
      expect(Array.isArray(fingerings)).toBe(true);
      expect(fingerings.length).toBeGreaterThan(0);
    });

    it("should handle sharp notes (F#)", () => {
      const fingerings = getChordFingerings("F#");
      expect(fingerings).not.toBeNull();
      expect(Array.isArray(fingerings)).toBe(true);
    });

    it("should handle flat notes (Bb)", () => {
      const fingerings = getChordFingerings("Bb");
      expect(fingerings).not.toBeNull();
      expect(Array.isArray(fingerings)).toBe(true);
    });

    it("should return null for invalid chord", () => {
      const fingerings = getChordFingerings("XYZ123");
      expect(fingerings).toBeNull();
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
      expect(result).toHaveProperty("fingers");
      expect(result).toHaveProperty("barres");
      expect(result).toHaveProperty("position");
      expect(result.position).toBe(1);
      expect(Array.isArray(result.fingers)).toBe(true);
      expect(Array.isArray(result.barres)).toBe(true);
    });

    it("should handle muted strings correctly", () => {
      const position = {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1
      };

      const result = convertToSVGuitarFormat(position);
      // First string (6th) should be muted
      expect(result.fingers[0]).toEqual([6, 'x']);
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
      expect(openStrings.length).toBeGreaterThan(0);
    });

    it("should convert barre chords correctly", () => {
      const position = {
        frets: [1, 1, 3, 3, 3, 1],
        fingers: [1, 1, 2, 3, 4, 1],
        barres: 1,
        baseFret: 3
      };

      const result = convertToSVGuitarFormat(position);
      expect(result.barres.length).toBeGreaterThan(0);
      expect(result.barres[0]).toHaveProperty("fromString");
      expect(result.barres[0]).toHaveProperty("toString");
      expect(result.barres[0]).toHaveProperty("fret");
      expect(result.barres[0].fret).toBe(1);
    });
  });

  describe("getChordVariations", () => {
    it("should return all variations for C major", () => {
      const variations = getChordVariations("C");
      expect(variations).not.toBeNull();
      expect(Array.isArray(variations)).toBe(true);
      expect(variations.length).toBeGreaterThan(0);

      // Each variation should be in svguitar format
      variations.forEach(variation => {
        expect(variation).toHaveProperty("fingers");
        expect(variation).toHaveProperty("barres");
        expect(variation).toHaveProperty("position");
      });
    });

    it("should return null for invalid chord", () => {
      const variations = getChordVariations("InvalidChord");
      expect(variations).toBeNull();
    });

    it("should return multiple variations", () => {
      const variations = getChordVariations("Am");
      expect(variations).not.toBeNull();
      // Most chords should have multiple fingering options
      expect(variations.length).toBeGreaterThan(1);
    });

    it("should return barre chords for F major", () => {
      const variations = getChordVariations("F");
      expect(variations).not.toBeNull();
      expect(Array.isArray(variations)).toBe(true);

      // F major typically has barre chord positions
      const hasBarrePosition = variations.some(v => v.barres.length > 0);
      expect(hasBarrePosition).toBe(true);

      // Check first position has a barre
      const firstVariation = variations[0];
      expect(firstVariation.barres.length).toBeGreaterThan(0);
      expect(firstVariation.barres[0]).toHaveProperty("fromString");
      expect(firstVariation.barres[0]).toHaveProperty("toString");
      expect(firstVariation.barres[0]).toHaveProperty("fret");
      expect(firstVariation.barres[0].fret).toBe(1);
    });
  });
});
