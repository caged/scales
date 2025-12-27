import { pentatonicPatterns, pentatonicPositionMapping } from "./patterns.js";

import { Note } from "tonal";

export default function pentatonic(strings, scale) {
  if (scale.intervals.length !== 5)
    throw new Error("Does not appear to be a pentatonic scale");

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

  // Pentatonic positions use CAGED shape naming: Position 1=G, 2=E, 3=D, 4=C, 5=A
  //
  // For minor pentatonic (e.g., C minor):
  //   Position 1 (G shape) starts on the root (C at fret 8)
  //
  // For major pentatonic (e.g., C major):
  //   Position 1 (G shape) starts on the 6th (A at fret 5)
  //
  // This means C major and A minor (which are relative and share notes)
  // have their Position 1 patterns at different fret locations

  // Determine if this is a major or minor pentatonic scale
  // Minor pentatonic: 1P 3m 4P 5P 7m
  // Major pentatonic: 1P 2M 3M 5P 6M
  const isMajor = intervals.includes("3M");

  // For major pentatonic, we need to rotate the pattern indices
  // This is because C major Position 1 should start at the 6th degree (A),
  // while C minor Position 1 starts at the root (C)
  // The offset is 4 positions forward (or 1 position backward) in the pentatonic scale
  const patternOffset = isMajor ? 4 : 0;

  const pentatonicShapes = Object.entries(pentatonicPositionMapping).map(
    ([pos, shape]) => {
      const basePattern = pentatonicPatterns[shape];
      // Rotate the pattern indices for major scales
      const rotatedPattern = basePattern.map((degreeArr) =>
        degreeArr.map((degree) => (degree + patternOffset) % 5)
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

        for (const shape of pentatonicShapes) {
          const stringPattern = shape.pattern[stringIndex];

          if (stringPattern.includes(scaleDegreeIndex % 5)) {
            positions.push(shape.position);
          }
        }

        semitone.positions.Pentatonic = [...new Set(positions)].sort();
        semitone.interval = scaleNote.interval;
      }
    }
  }

  return strings;
}
