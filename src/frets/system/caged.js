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

  // Build a map from chroma to scale degree and interval
  const chromaToScaleDegree = new Map();
  const chromaToInterval = new Map();

  scale.notes.forEach((noteName, index) => {
    const noteObj = Note.get(noteName);
    // For diatonic (7 notes): degrees are 1-7
    // For pentatonic (5 notes): degrees are 0-4 (0-indexed as in the patterns)
    const degree = noteCount === 7 ? index + 1 : index;
    chromaToScaleDegree.set(noteObj.chroma, degree);
    chromaToInterval.set(noteObj.chroma, scale.intervals[index]);
  });

  // Determine if this is a minor scale (has minor 3rd)
  const isMinor = scale.intervals.includes("3m");

  // Build CAGED shapes with their patterns
  // For minor scales, rotate the diatonic pattern degrees by +2
  // This shifts the shapes so that G shape root aligns at fret 8 instead of fret 5
  const basePatterns = noteCount === 5 ? pentatonicPatterns : diatonicPatterns;

  const cagedShapes = Object.entries(cagedPositionMapping).map(
    ([pos, shape]) => {
      let pattern = basePatterns[shape];

      // For 7-note minor scales, rotate degrees by +2
      if (noteCount === 7 && isMinor) {
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
