import { Chord } from 'tonal';
import guitar from '@tombatossals/chords-db/lib/guitar.json';

console.log('Loaded guitar chords database:', guitar);
/**
 * Get fingering positions for a chord using the chords-db library
 *
 * @param {string} chordName - The chord name (e.g., "Amin7", "C", "Gmaj7")
 * @returns {Array|null} Array of fingering positions or null if not found
 *
 * @example
 * const fingerings = getChordFingerings("Amin7");
 * // Returns array of positions with frets, fingers, barres, etc.
 *
 * const positions = getChordFingerings("C");
 * // Returns:
 * // [{
 * //   frets: [-1, 3, 2, 0, 1, 0],
 * //   fingers: [0, 3, 2, 0, 1, 0],
 * //   baseFret: 1,
 * //   barres: [],
 * //   midi: [48, 52, 55, 60, 64]
 * // }, ...]
 */
export function getChordFingerings(chordName) {
  // Parse the chord using Tonal to get the tonic and suffix
  const chord = Chord.get(chordName);
  console.log(chordName, chord);
  

  if (chord.empty) {
    console.warn(`Invalid chord: ${chordName}`);
    return null;
  }

  const tonic = chord.tonic;
  const suffix = chord.aliases?.[0] || chord.type;

  // Normalize the tonic for the database
  // The database uses keys like "C", "Csharp", "D", "Eb", etc.
  const keyMap = {
    'C': 'C',
    'C#': 'Csharp',
    'Db': 'Csharp',
    'D': 'D',
    'D#': 'Eb',
    'Eb': 'Eb',
    'E': 'E',
    'F': 'F',
    'F#': 'Fsharp',
    'Gb': 'Fsharp',
    'G': 'G',
    'G#': 'Ab',
    'Ab': 'Ab',
    'A': 'A',
    'A#': 'Bb',
    'Bb': 'Bb',
    'B': 'B'
  };

  const dbKey = keyMap[tonic];

  if (!dbKey) {
    console.warn(`Unknown tonic: ${tonic}`);
    return null;
  }

  // Find the chord in the database
  const chordData = guitar.chords[dbKey];

  if (!chordData) {
    console.warn(`No chords found for key: ${dbKey}`);
    return null;
  }

  // Search for matching suffix
  // Try exact match first, then try common variations
  const suffixVariations = [
    suffix,
    chord.type,
    ...chord.aliases
  ];

  for (const suffixVariant of suffixVariations) {
    const match = chordData.find(c => c.suffix === suffixVariant);
    if (match) {
      return match.positions;
    }
  }

  console.warn(`No fingerings found for ${chordName} (key: ${dbKey}, suffix: ${suffix})`);
  return null;
}

/**
 * Convert chords-db format to svguitar format
 *
 * @param {Object} position - A position object from chords-db
 * @returns {Object} Chord data formatted for svguitar
 *
 * @example
 * const dbPosition = {
 *   frets: [-1, 3, 2, 0, 1, 0],
 *   fingers: [0, 3, 2, 0, 1, 0],
 *   baseFret: 1,
 *   barres: [],
 * };
 *
 * const svguitarChord = convertToSVGuitarFormat(dbPosition);
 * // Returns:
 * // {
 * //   fingers: [[2, 3, '3'], [3, 2, '2'], [5, 1, '1']],
 * //   barres: [],
 * //   position: 1
 * // }
 */
export function convertToSVGuitarFormat(position) {
  const { frets, fingers: fingerPositions, barres, baseFret = 1 } = position;

  const svguitarFingers = [];

  // Convert fret positions to svguitar format
  // String numbering: chords-db uses 0-5 (low to high), svguitar uses 1-6 (high to low)
  for (let i = 0; i < frets.length; i++) {
    const fret = frets[i];
    const finger = fingerPositions?.[i];
    const stringNumber = 6 - i; // Reverse string order

    if (fret === -1 || fret === 'x') {
      // Muted string
      svguitarFingers.push([stringNumber, 'x']);
    } else if (fret === 0) {
      // Open string
      svguitarFingers.push([stringNumber, 0]);
    } else {
      // Fretted note
      const label = finger ? finger.toString() : '';
      svguitarFingers.push([stringNumber, fret, label]);
    }
  }

  // Convert barres if present
  const svguitarBarres = [];
  if (barres && typeof barres === 'number') {
    // Find the range of strings for the barre
    const barreFret = barres;
    const barreStrings = [];

    for (let i = 0; i < frets.length; i++) {
      if (frets[i] === barreFret) {
        barreStrings.push(6 - i);
      }
    }

    if (barreStrings.length > 1) {
      svguitarBarres.push({
        fromString: Math.max(...barreStrings),
        toString: Math.min(...barreStrings),
        fret: barreFret
      });
    }
  }

  return {
    fingers: svguitarFingers,
    barres: svguitarBarres,
    position: baseFret
  };
}

/**
 * Get all fingering variations for a chord in svguitar format
 *
 * @param {string} chordName - The chord name (e.g., "Amin7", "C", "Gmaj7")
 * @returns {Array|null} Array of chord positions formatted for svguitar
 *
 * @example
 * const variations = getChordVariations("C");
 * // Returns multiple fingering options, each ready to use with svguitar
 */
export function getChordVariations(chordName) {
  const positions = getChordFingerings(chordName);

  if (!positions) {
    return null;
  }

  return positions.map(pos => convertToSVGuitarFormat(pos));
}
