import {
  cagedPositionMapping,
  diatonicPatterns,
  pentatonicPatterns,
  pentatonicPositionMapping,
} from "./patterns.js";

import { Note } from "tonal";

export default function caged(strings, scale) {
  const noteCount = scale.intervals.length;
  if (noteCount !== 5 && noteCount !== 7)
    throw new Error(
      "CAGED system only works with 5-note pentatonic or 7-note scales"
    );

  const intervals = scale.intervals;
  const snotes = scale.notes;
  const scaleNotes = snotes.map((noteName, i) => {
    const noteObj = Note.get(noteName);
    return {
      note: noteObj,
      interval: intervals[i],
      name: noteName,
    };
  });

  // CAGED system uses position mapping: Position 1=C, 2=A, 3=G, 4=E, 5=D
  // For pentatonic (5 notes), use pentatonicPatterns (2 notes per string)
  // For diatonic (7 notes), use diatonicPatterns (3 notes per string)
  const basePatterns = noteCount === 5 ? pentatonicPatterns : diatonicPatterns;

  // Determine if this is a major or minor scale for rotation
  const isMajor = intervals.includes("3M");

  console.log("isMajor:", isMajor, intervals, scale);

  // For major scales, rotate the pattern indices
  // This aligns the patterns correctly with the scale degrees
  // const patternOffset = (noteCount === 5 && isMajor) ? 4 : 0;
  const patternOffset = isMajor ? 4 : 0;

  const cagedShapes = Object.entries(cagedPositionMapping).map(
    ([pos, shape]) => {
      const basePattern = basePatterns[shape];

      // Rotate the pattern indices for major scales
      const rotatedPattern = basePattern.map((degreeArr) =>
        degreeArr.map((degree) => (degree + patternOffset) % noteCount)
      );

      return {
        position: parseInt(pos),
        shape: shape,
        pattern: rotatedPattern,
      };
    }
  );

  for (let stringIndex = 0; stringIndex < strings.length; stringIndex++) {
    const str = strings[stringIndex];

    for (const semitone of str) {
      const scaleNote = scaleNotes.find(
        (sn) => sn.note.chroma === semitone.note.chroma
      );

      if (scaleNote) {
        const positions = [];
        const scaleDegreeIndex = scaleNotes.findIndex(
          (sn) => sn.note.chroma === semitone.note.chroma
        );

        for (const shape of cagedShapes) {
          const stringPattern = shape.pattern[stringIndex];

          if (stringPattern.includes(scaleDegreeIndex % noteCount)) {
            positions.push(shape.position);
          }
        }

        // Store positions under the CAGED system key
        semitone.positions.CAGED = [...new Set(positions)].sort();
        semitone.interval = scaleNote.interval;
      }
    }
  }

  return strings;
}
