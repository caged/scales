import { Key, Mode, Scale, Chord } from "tonal";

/**
 * Get diatonic seventh chords built on each degree of a scale.
 *
 * This function uses the Tonal library's built-in functions to get the proper
 * diatonic chords for a given scale. It works best with major/minor keys and
 * the 7 standard modes (ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian).
 *
 * For major keys, returns: I-ii-iii-IV-V-vi-vii° (as seventh chords)
 * For minor keys, returns the natural minor seventh chords by default
 *
 * @param {string} scaleName - The scale name with tonic (e.g., "C major", "A minor", "D dorian")
 * @returns {Array} Array of chord names with tonics (e.g., ["Cmaj7", "Dm7", "Em7", ...])
 *
 * @example
 * getDiatonicSeventhChords("C major")
 * // => ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"]
 *
 * getDiatonicSeventhChords("A minor")
 * // => ["Am7", "Bm7b5", "Cmaj7", "Dm7", "Em7", "Fmaj7", "G7"]
 *
 * getDiatonicSeventhChords("D dorian")
 * // => ["Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5", "Cmaj7"]
 */
export function getDiatonicSeventhChords(scaleName) {
  const scale = Scale.get(scaleName);

  if (scale.empty || !scale.tonic) {
    return [];
  }

  const scaleType = scale.type;
  const tonic = scale.tonic;

  // Try using Key.majorKey for major scales
  if (scaleType === "major" || scaleType === "ionian") {
    return Key.majorKey(tonic).chords;
  }

  // Try using Key.minorKey for minor scales (returns natural minor)
  if (scaleType === "minor" || scaleType === "aeolian") {
    return Key.minorKey(tonic).natural.chords;
  }

  // For other modes, use Mode.seventhChords
  const modeChords = Mode.seventhChords(scaleType, tonic);
  if (modeChords && modeChords.length > 0) {
    return modeChords;
  }

  // Fallback: build chords manually for non-standard scales
  return buildDiatonicSeventhChords(scale);
}

/**
 * Get diatonic triads built on each degree of a scale.
 *
 * @param {string} scaleName - The scale name with tonic (e.g., "C major", "A minor")
 * @returns {Array} Array of chord names (e.g., ["C", "Dm", "Em", "F", "G", "Am", "Bdim"])
 *
 * @example
 * getDiatonicTriads("C major")
 * // => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]
 */
export function getDiatonicTriads(scaleName) {
  const scale = Scale.get(scaleName);

  if (scale.empty || !scale.tonic) {
    return [];
  }

  const scaleType = scale.type;
  const tonic = scale.tonic;

  // Try using Key.majorKey for major scales
  if (scaleType === "major" || scaleType === "ionian") {
    return Key.majorKey(tonic).triads;
  }

  // Try using Key.minorKey for minor scales (returns natural minor)
  if (scaleType === "minor" || scaleType === "aeolian") {
    return Key.minorKey(tonic).natural.triads;
  }

  // For other modes, use Mode.triads
  const modeTriads = Mode.triads(scaleType, tonic);
  if (modeTriads && modeTriads.length > 0) {
    return modeTriads;
  }

  // Fallback: build triads manually for non-standard scales
  return buildDiatonicTriads(scale);
}

/**
 * Get harmonic minor seventh chords for a minor key.
 *
 * @param {string} tonic - The tonic note (e.g., "A", "C")
 * @returns {Array} Array of harmonic minor seventh chords
 *
 * @example
 * getHarmonicMinorChords("A")
 * // => ["AmMaj7", "Bm7b5", "C+maj7", "Dm7", "E7", "Fmaj7", "G#o7"]
 */
export function getHarmonicMinorChords(tonic) {
  return Key.minorKey(tonic).harmonic.chords;
}

/**
 * Get melodic minor seventh chords for a minor key.
 *
 * @param {string} tonic - The tonic note (e.g., "A", "C")
 * @returns {Array} Array of melodic minor seventh chords
 *
 * @example
 * getMelodicMinorChords("A")
 * // => ["Am6", "Bm7", "C+maj7", "D7", "E7", "F#m7b5", "G#m7b5"]
 */
export function getMelodicMinorChords(tonic) {
  return Key.minorKey(tonic).melodic.chords;
}

/**
 * Fallback function to manually build diatonic seventh chords for any scale.
 * This is used when the scale is not a standard mode.
 */
function buildDiatonicSeventhChords(scale) {
  const scaleNotes = scale.notes;
  const diatonicChords = [];

  for (let i = 0; i < scaleNotes.length; i++) {
    const chordNotes = [
      scaleNotes[i % scaleNotes.length],                    // root
      scaleNotes[(i + 2) % scaleNotes.length],              // 3rd
      scaleNotes[(i + 4) % scaleNotes.length],              // 5th
      scaleNotes[(i + 6) % scaleNotes.length],              // 7th
    ];

    const detectedChords = Chord.detect(chordNotes);
    if (detectedChords.length > 0) {
      diatonicChords.push(detectedChords[0]);
    }
  }

  return diatonicChords;
}

/**
 * Fallback function to manually build diatonic triads for any scale.
 * This is used when the scale is not a standard mode.
 */
function buildDiatonicTriads(scale) {
  const scaleNotes = scale.notes;
  const diatonicChords = [];

  for (let i = 0; i < scaleNotes.length; i++) {
    const chordNotes = [
      scaleNotes[i % scaleNotes.length],                    // root
      scaleNotes[(i + 2) % scaleNotes.length],              // 3rd
      scaleNotes[(i + 4) % scaleNotes.length],              // 5th
    ];

    const detectedChords = Chord.detect(chordNotes);
    if (detectedChords.length > 0) {
      diatonicChords.push(detectedChords[0]);
    }
  }

  return diatonicChords;
}
