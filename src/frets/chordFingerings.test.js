import { describe, it, expect } from "vitest";
import { convertToSVGuitarFormat, getChordFingerings, getChordVariations } from "./chordFingerings.js";

describe("chordFingerings tests", () => {
  describe("getChordFingerings", () => {
    it("should get fingerings for Amin7", () => {
      const result = getChordFingerings("Amin7");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(result).toHaveProperty("name");
      expect(Array.isArray(result.positions)).toBe(true);
      expect(result.positions.length).toBeGreaterThan(0);
      expect(result.positions[0]).toHaveProperty("frets");
      expect(result.positions[0]).toHaveProperty("fingers");
    });

    it("should get fingerings for C major", () => {
      const result = getChordFingerings("C");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(result).toHaveProperty("name");
      expect(Array.isArray(result.positions)).toBe(true);
      expect(result.positions.length).toBeGreaterThan(0);
    });

    it("should get fingerings for Cmaj", () => {
      const result = getChordFingerings("Cmaj");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(result).toHaveProperty("name");
      expect(Array.isArray(result.positions)).toBe(true);
    });

    it("should get fingerings for G7", () => {
      const result = getChordFingerings("G7");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(result).toHaveProperty("name");
      expect(Array.isArray(result.positions)).toBe(true);
      expect(result.positions.length).toBeGreaterThan(0);
    });

    it("should get fingerings for Dmaj7", () => {
      const result = getChordFingerings("Dmaj7");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(result).toHaveProperty("name");
      expect(Array.isArray(result.positions)).toBe(true);
      expect(result.positions.length).toBeGreaterThan(0);
    });

    it("should handle sharp notes (F#)", () => {
      const result = getChordFingerings("F#");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(result).toHaveProperty("name");
      expect(Array.isArray(result.positions)).toBe(true);
      expect(result.name).toBe("Fsharpmajor");
    });

    it("should handle flat notes (Bb)", () => {
      const result = getChordFingerings("Bb");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(result).toHaveProperty("name");
      expect(Array.isArray(result.positions)).toBe(true);
      expect(result.name).toBe("Bbmajor");
    });

    it("should handle E# (enharmonic to F)", () => {
      const eSharpResult = getChordFingerings("E#");
      const fResult = getChordFingerings("F");

      expect(eSharpResult).not.toBeNull();
      expect(fResult).not.toBeNull();
      expect(Array.isArray(eSharpResult.positions)).toBe(true);
      expect(eSharpResult.positions.length).toBeGreaterThan(0);

      // E# and F should return the same fingerings and name
      expect(eSharpResult).toEqual(fResult);
    });

    it("should handle B# (enharmonic to C)", () => {
      const bSharpResult = getChordFingerings("B#");
      const cResult = getChordFingerings("C");

      expect(bSharpResult).not.toBeNull();
      expect(cResult).not.toBeNull();
      expect(Array.isArray(bSharpResult.positions)).toBe(true);
      expect(bSharpResult.positions.length).toBeGreaterThan(0);

      // B# and C should return the same fingerings and name
      expect(bSharpResult).toEqual(cResult);
    });

    it("should handle E#maj7 chord", () => {
      const eSharpMaj7 = getChordFingerings("E#maj7");
      const fMaj7 = getChordFingerings("Fmaj7");

      expect(eSharpMaj7).not.toBeNull();
      expect(fMaj7).not.toBeNull();
      expect(eSharpMaj7).toEqual(fMaj7);
    });

    it("should handle B#m chord", () => {
      const bSharpMin = getChordFingerings("B#m");
      const cMin = getChordFingerings("Cm");

      expect(bSharpMin).not.toBeNull();
      expect(cMin).not.toBeNull();
      expect(bSharpMin).toEqual(cMin);
    });

    it("should return null for invalid chord", () => {
      const result = getChordFingerings("XYZ123");
      expect(result).toBeNull();
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

    it("should preserve MIDI data when present", () => {
      const position = {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1,
        barres: [],
        midi: [43, 48, 52, 55, 59, 64]
      };

      const result = convertToSVGuitarFormat(position);
      expect(result).toHaveProperty("midi");
      expect(result.midi).toEqual([43, 48, 52, 55, 59, 64]);
    });

    it("should work without MIDI data", () => {
      const position = {
        frets: [-1, 3, 2, 0, 1, 0],
        fingers: [0, 3, 2, 0, 1, 0],
        baseFret: 1,
        barres: []
      };

      const result = convertToSVGuitarFormat(position);
      expect(result).not.toHaveProperty("midi");
    });
  });

  describe("getChordVariations", () => {
    it("should return all variations for C major", () => {
      const result = getChordVariations("C");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(Array.isArray(result.positions)).toBe(true);
      expect(result.positions.length).toBeGreaterThan(0);

      // Each variation should be in svguitar format
      result.positions.forEach(variation => {
        expect(variation).toHaveProperty("fingers");
        expect(variation).toHaveProperty("barres");
        expect(variation).toHaveProperty("position");
      });
    });

    it("should preserve MIDI data in all variations", () => {
      const result = getChordVariations("C");
      expect(result).not.toBeNull();
      expect(result.positions.length).toBeGreaterThan(0);

      // Each variation should have MIDI data
      result.positions.forEach(variation => {
        expect(variation).toHaveProperty("midi");
        expect(Array.isArray(variation.midi)).toBe(true);
        expect(variation.midi.length).toBeGreaterThan(0);
      });
    });

    it("should return null for invalid chord", () => {
      const result = getChordVariations("InvalidChord");
      expect(result).toBeNull();
    });

    it("should return multiple variations", () => {
      const result = getChordVariations("Am");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      // Most chords should have multiple fingering options
      expect(result.positions.length).toBeGreaterThan(1);
    });

    it("should return barre chords for F major", () => {
      const result = getChordVariations("F");
      expect(result).not.toBeNull();
      expect(result).toHaveProperty("positions");
      expect(Array.isArray(result.positions)).toBe(true);

      // F major typically has barre chord positions
      const hasBarrePosition = result.positions.some(v => v.barres.length > 0);
      expect(hasBarrePosition).toBe(true);

      // Check first position has a barre
      const firstVariation = result.positions[0];
      expect(firstVariation.barres.length).toBeGreaterThan(0);
      expect(firstVariation.barres[0]).toHaveProperty("fromString");
      expect(firstVariation.barres[0]).toHaveProperty("toString");
      expect(firstVariation.barres[0]).toHaveProperty("fret");
      expect(firstVariation.barres[0].fret).toBe(1);
    });
  });
});
