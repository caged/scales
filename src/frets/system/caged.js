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

  // CAGED shapes define which scale degrees appear on each string for each position
  // Patterns are in scale degree indices (0-based: 0=root, 1=2nd, 2=3rd, etc.)
  // Strings are in reversed order: [high E, B, G, D, A, low E]
  const cagedShapes = {
    C: {
      position: 1,
      pattern: [
        [2, 3, 4], // High E string: 3rd, 4th, 5th
        [5, 6, 0], // B string: 6th, 7th, root
        [3, 4, 5], // G string: 4th, 5th, 6th
        [1, 2],    // D string: 2nd, 3rd
        [6, 0],    // A string: 7th, root
        [3, 4, 5], // Low E string: 4th, 5th, 6th
      ],
    },
    A: {
      position: 2,
      pattern: [
        [5, 6, 0], // High E string: 6th, 7th, root
        [0, 1, 2], // B string: root, 2nd, 3rd
        [5, 6, 0], // G string: 6th, 7th, root
        [2, 3, 4], // D string: 3rd, 4th, 5th
        [0, 1, 2], // A string: root, 2nd, 3rd
        [5, 6, 0], // Low E string: 6th, 7th, root
      ],
    },
    G: {
      position: 3,
      pattern: [
        [0, 1, 2], // High E string: root, 2nd, 3rd
        [4, 5, 6], // B string: 5th, 6th, 7th
        [2, 3, 4], // G string: 3rd, 4th, 5th
        [6, 0, 1], // D string: 7th, root, 2nd
        [4, 5, 6], // A string: 5th, 6th, 7th
        [2, 3, 4], // Low E string: 3rd, 4th, 5th
      ],
    },
    E: {
      position: 4,
      pattern: [
        [0, 1, 2], // High E string: root, 2nd, 3rd
        [5, 6, 0], // B string: 6th, 7th, root
        [3, 4, 5], // G string: 4th, 5th, 6th
        [1, 2, 3], // D string: 2nd, 3rd, 4th
        [6, 0, 1], // A string: 7th, root, 2nd
        [3, 4, 5], // Low E string: 4th, 5th, 6th
      ],
    },
    D: {
      position: 5,
      pattern: [
        [5, 6, 0], // High E string: 6th, 7th, root
        [3, 4, 5], // B string: 4th, 5th, 6th
        [0, 1, 2], // G string: root, 2nd, 3rd
        [5, 6, 0], // D string: 6th, 7th, root
        [3, 4],    // A string: 4th, 5th
        [0, 1, 2], // Low E string: root, 2nd, 3rd
      ],
    },
  };

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

        for (const shape of Object.values(cagedShapes)) {
          const stringPattern = shape.pattern[stringIndex];

          if (noteCount === 5) {
            // For pentatonic scales, filter out the 3rd and 6th degrees
            // and adjust the remaining degrees accordingly
            const pentatonicPattern = stringPattern
              .filter((d) => d !== 3 && d !== 6)
              .map((d) => (d > 3 ? d - 1 : d))
              .map((d) => (d > 5 ? d - 2 : d));

            if (pentatonicPattern.includes(scaleDegreeIndex % noteCount)) {
              positions.push(shape.position);
            }
          } else {
            // For 7-note scales, use the pattern as-is
            if (stringPattern.includes(scaleDegreeIndex % noteCount)) {
              positions.push(shape.position);
            }
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
