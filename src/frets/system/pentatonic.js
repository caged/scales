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
  //
  // Each pattern defines which scale degrees (0-4) appear on each string
  // Patterns are 2 notes per string
  // Strings are in reversed order: [high E, B, G, D, A, low E]

  // Physical patterns for each CAGED shape
  const shapePatterns = {
    G: [
      [0, 1], // High E string: root, 2nd
      [3, 4], // B string: 5th, m7 (or 6th in major)
      [1, 2], // G string: 2nd, 4th
      [4, 0], // D string: m7/6th, root
      [2, 3], // A string: 4th, 5th
      [0, 1], // Low E string: root, 2nd
    ],
    E: [
      [1, 2], // High E string: 2nd, 4th
      [4, 0], // B string: m7/6th, root
      [2, 3], // G string: 4th, 5th
      [0, 1], // D string: root, 2nd
      [3, 4], // A string: 5th, m7/6th
      [1, 2], // Low E string: 2nd, 4th
    ],
    D: [
      [2, 3], // High E string: 4th, 5th
      [0, 1], // B string: root, 2nd
      [3, 4], // G string: 5th, m7/6th
      [1, 2], // D string: 2nd, 4th
      [4, 0], // A string: m7/6th, root
      [2, 3], // Low E string: 4th, 5th
    ],
    C: [
      [3, 4], // High E string: 5th, m7/6th
      [1, 2], // B string: 2nd, 4th
      [4, 0], // G string: m7/6th, root
      [2, 3], // D string: 4th, 5th
      [0, 1], // A string: root, 2nd
      [3, 4], // Low E string: 5th, m7/6th
    ],
    A: [
      [4, 0], // High E string: m7/6th, root
      [2, 3], // B string: 4th, 5th
      [0, 1], // G string: root, 2nd
      [3, 4], // D string: 5th, m7/6th
      [1, 2], // A string: 2nd, 4th
      [4, 0], // Low E string: m7/6th, root
    ],
  };

  // Determine if this is a major or minor pentatonic scale
  // Minor pentatonic: 1P 3m 4P 5P 7m
  // Major pentatonic: 1P 2M 3M 5P 6M
  const isMajor = intervals.includes("3M");

  // Position-to-shape mapping is always: Position 1=G, 2=E, 3=D, 4=C, 5=A
  const positionMapping = { 1: "G", 2: "E", 3: "D", 4: "C", 5: "A" };

  // For major pentatonic, we need to rotate the pattern indices
  // This is because C major Position 1 should start at the 6th degree (A),
  // while C minor Position 1 starts at the root (C)
  // The offset is 4 positions forward (or 1 position backward) in the pentatonic scale
  const patternOffset = isMajor ? 4 : 0;

  const pentatonicShapes = Object.entries(positionMapping).map(
    ([pos, shape]) => {
      const basePattern = shapePatterns[shape];
      // Rotate the pattern indices for major scales
      const rotatedPattern = basePattern.map(degreeArr =>
        degreeArr.map(degree => (degree + patternOffset) % 5)
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
