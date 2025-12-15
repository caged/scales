import { assert } from "chai";
import {
  getDiatonicSeventhChords,
  getDiatonicTriads,
  getHarmonicMinorChords,
  getMelodicMinorChords,
} from "./diatonicChords.js";

describe("diatonicChords", () => {
  describe("getDiatonicSeventhChords", () => {
    it("should return seventh chords for C major", () => {
      const chords = getDiatonicSeventhChords("C major");
      assert.deepEqual(chords, [
        "Cmaj7",
        "Dm7",
        "Em7",
        "Fmaj7",
        "G7",
        "Am7",
        "Bm7b5",
      ]);
    });

    it("should return seventh chords for A minor (natural)", () => {
      const chords = getDiatonicSeventhChords("A minor");
      assert.deepEqual(chords, [
        "Am7",
        "Bm7b5",
        "Cmaj7",
        "Dm7",
        "Em7",
        "Fmaj7",
        "G7",
      ]);
    });

    it("should return seventh chords for D dorian", () => {
      const chords = getDiatonicSeventhChords("D dorian");
      assert.deepEqual(chords, [
        "Dm7",
        "Em7",
        "FMaj7",
        "G7",
        "Am7",
        "Bm7b5",
        "CMaj7",
      ]);
    });

    it("should return seventh chords for E phrygian", () => {
      const chords = getDiatonicSeventhChords("E phrygian");
      assert.deepEqual(chords, [
        "Em7",
        "FMaj7",
        "G7",
        "Am7",
        "Bm7b5",
        "CMaj7",
        "Dm7",
      ]);
    });

    it("should return empty array for invalid scale", () => {
      const chords = getDiatonicSeventhChords("invalid");
      assert.deepEqual(chords, []);
    });

    it("should return empty array for scale without tonic", () => {
      const chords = getDiatonicSeventhChords("major");
      assert.deepEqual(chords, []);
    });
  });

  describe("getDiatonicTriads", () => {
    it("should return triads for C major", () => {
      const chords = getDiatonicTriads("C major");
      assert.deepEqual(chords, ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]);
    });

    it("should return triads for A minor", () => {
      const chords = getDiatonicTriads("A minor");
      assert.deepEqual(chords, ["Am", "Bdim", "C", "Dm", "Em", "F", "G"]);
    });

    it("should return triads for G mixolydian", () => {
      const chords = getDiatonicTriads("G mixolydian");
      assert.deepEqual(chords, ["G", "Am", "Bdim", "C", "Dm", "Em", "F"]);
    });
  });

  describe("getHarmonicMinorChords", () => {
    it("should return harmonic minor chords for A", () => {
      const chords = getHarmonicMinorChords("A");
      assert.deepEqual(chords, [
        "AmMaj7",
        "Bm7b5",
        "C+maj7",
        "Dm7",
        "E7",
        "Fmaj7",
        "G#o7",
      ]);
    });
  });

  describe("getMelodicMinorChords", () => {
    it("should return melodic minor chords for A", () => {
      const chords = getMelodicMinorChords("A");
      assert.deepEqual(chords, [
        "Am6",
        "Bm7",
        "C+maj7",
        "D7",
        "E7",
        "F#m7b5",
        "G#m7b5",
      ]);
    });
  });
});
