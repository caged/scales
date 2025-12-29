import {
  cagedPositionMapping,
  diatonicPatterns,
  pentatonicPatterns,
} from "./patterns.js";

import { Note } from "tonal";

// Rotate a 1-indexed degree (1-7) by an offset
function rotateDegree(degree, offset) {
  return ((degree - 1 + offset) % 7) + 1;
}

export default function caged(strings, scale) {
  const noteCount = scale.intervals.length;
  if (noteCount !== 5 && noteCount !== 7)
    throw new Error(
      "CAGED system only works with 5-note pentatonic or 7-note scales"
    );

  // Determine if this is a minor scale (has minor 3rd)
  const isMinor = scale.intervals.includes("3m");

  // Build a map from chroma to scale degree and interval
  // Both pentatonic and diatonic patterns use 7-degree format
  const chromaToScaleDegree = new Map();
  const chromaToInterval = new Map();

  if (noteCount === 5) {
    // Pentatonic: map notes to their 7-degree equivalents
    // Major pentatonic uses degrees: 1, 2, 3, 5, 6
    // Minor pentatonic uses degrees: 1, 3, 4, 5, 7
    const majorDegrees = [1, 2, 3, 5, 6];
    const minorDegrees = [1, 3, 4, 5, 7];
    const degreeMapping = isMinor ? minorDegrees : majorDegrees;

    scale.notes.forEach((noteName, index) => {
      const noteObj = Note.get(noteName);
      chromaToScaleDegree.set(noteObj.chroma, degreeMapping[index]);
      chromaToInterval.set(noteObj.chroma, scale.intervals[index]);
    });
  } else {
    // Diatonic: degrees are 1-7
    scale.notes.forEach((noteName, index) => {
      const noteObj = Note.get(noteName);
      chromaToScaleDegree.set(noteObj.chroma, index + 1);
      chromaToInterval.set(noteObj.chroma, scale.intervals[index]);
    });
  }

  // Build CAGED shapes with their patterns
  // For minor scales, rotate the pattern degrees by +2
  // This shifts the shapes so that G shape root aligns at fret 8 instead of fret 5
  const basePatterns = noteCount === 5 ? pentatonicPatterns : diatonicPatterns;

  const cagedShapes = Object.entries(cagedPositionMapping).map(
    ([pos, shape]) => {
      let pattern = basePatterns[shape];

      // For minor scales (both pentatonic and diatonic), rotate degrees by +2
      if (isMinor) {
        pattern = pattern.map((stringDegrees) =>
          stringDegrees.map((degree) => rotateDegree(degree, 2))
        );
      }

      return {
        position: parseInt(pos),
        shape: shape,
        pattern: pattern,
      };
    }
  );

  // Process each string and note
  for (let stringIndex = 0; stringIndex < strings.length; stringIndex++) {
    const string = strings[stringIndex];

    for (const fretNote of string) {
      const chroma = fretNote.note.chroma;

      // Skip notes not in the scale
      if (!chromaToScaleDegree.has(chroma)) continue;

      const scaleDegree = chromaToScaleDegree.get(chroma);
      const positions = [];

      // Check each CAGED shape to see if this scale degree is on this string
      for (const shape of cagedShapes) {
        const stringPattern = shape.pattern[stringIndex];
        if (stringPattern.includes(scaleDegree)) {
          positions.push(shape.position);
        }
      }

      fretNote.positions.CAGED = [...new Set(positions)].sort();
      fretNote.interval = chromaToInterval.get(chroma);
    }
  }

  return strings;
}
