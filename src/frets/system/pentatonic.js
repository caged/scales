import { pentatonicPatterns, pentatonicPositionMapping } from "./patterns.js";

import { Note } from "tonal";

// Helper to rotate 1-indexed degrees (1-7) in mod 7
function rotateDegree(degree, offset) {
  return ((degree - 1 + offset) % 7) + 1;
}

export default function pentatonic(strings, scale) {
  if (scale.intervals.length !== 5)
    throw new Error("Does not appear to be a pentatonic scale");

  const intervals = scale.intervals;
  const snotes = scale.notes;

  // Determine if this is a major or minor pentatonic scale
  // Minor pentatonic: 1P 3m 4P 5P 7m
  // Major pentatonic: 1P 2M 3M 5P 6M
  const isMinor = intervals.includes("3m");

  // Map pentatonic scale notes to their 7-degree equivalents
  // Major pentatonic uses degrees: 1, 2, 3, 5, 6
  // Minor pentatonic uses degrees: 1, 3, 4, 5, 7
  const majorDegrees = [1, 2, 3, 5, 6];
  const minorDegrees = [1, 3, 4, 5, 7];
  const degreeMapping = isMinor ? minorDegrees : majorDegrees;

  // Build a map from note chroma to its 7-degree scale degree
  const chromaToScaleDegree = new Map();
  const chromaToInterval = new Map();

  snotes.forEach((noteName, index) => {
    const noteObj = Note.get(noteName);
    chromaToScaleDegree.set(noteObj.chroma, degreeMapping[index]);
    chromaToInterval.set(noteObj.chroma, intervals[index]);
  });

  // For minor pentatonic, rotate the pattern degrees by +2 (same as diatonic)
  // This aligns the minor patterns correctly with the major-based pattern definitions
  const pentatonicShapes = Object.entries(pentatonicPositionMapping).map(
    ([pos, shape]) => {
      let pattern = pentatonicPatterns[shape];

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

  for (let stringIndex = 0; stringIndex < strings.length; stringIndex++) {
    const str = strings[stringIndex];

    for (const semitone of str) {
      const chroma = semitone.note.chroma;

      if (!chromaToScaleDegree.has(chroma)) continue;

      const scaleDegree = chromaToScaleDegree.get(chroma);
      const positions = [];

      for (const shape of pentatonicShapes) {
        const stringPattern = shape.pattern[stringIndex];

        if (stringPattern.includes(scaleDegree)) {
          positions.push(shape.position);
        }
      }

      semitone.positions.Pentatonic = [...new Set(positions)].sort();
      semitone.interval = chromaToInterval.get(chroma);
    }
  }

  return strings;
}
