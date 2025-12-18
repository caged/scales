export default function caged(strings, scale) {
  const noteCount = scale.intervals().length;
  if (noteCount !== 5 && noteCount !== 7)
    throw new Error(
      "CAGED system only works with 5-note pentatonic or 7-note scales"
    );

  const intervals = scale.intervals();
  const snotes = scale.notes();
  const scaleNotes = snotes.map((note, i) => {
    return {
      note,
      interval: intervals[i],
      name: note.name,
    };
  });

  // CAGED system is based on 5 moveable chord shapes
  // Each shape defines which scale degrees appear on each string
  // Shapes are defined relative to where the root note appears
  //
  // String order: 0=E (low), 1=A, 2=D, 3=G, 4=B, 5=E (high)
  // Values are scale degree indices (0-based: 0=root, 1=2nd, 2=3rd, etc.)
  //
  // The shapes connect: C -> A -> G -> E -> D -> (back to C)

  const cagedShapes = {
    // C shape: root typically on A string (string 1)
    C: {
      position: 1,
      pattern: [
        [2, 3, 4], // E string (low): 3rd, 4th, 5th
        [5, 6, 0], // A string: 6th, 7th, root
        [3, 4, 5], // D string: 4th, 5th, 6th
        [1, 2], // G string: 2nd, 3rd (only 2 notes)
        [6, 0], // B string: 7th, root (only 2 notes)
        [3, 4, 5], // E string (high): 4th, 5th, 6th
      ],
    },
    // A shape: root on A string (string 1)
    A: {
      position: 2,
      pattern: [
        [5, 6, 0], // E string (low): 6th, 7th, root
        [0, 1, 2], // A string: root, 2nd, 3rd
        [5, 6, 0], // D string: 6th, 7th, root
        [2, 3, 4], // G string: 3rd, 4th, 5th
        [0, 1, 2], // B string: root, 2nd, 3rd
        [5, 6, 0], // E string (high): 6th, 7th, root
      ],
    },
    // G shape: root on E string (low)
    G: {
      position: 3,
      pattern: [
        [0, 1, 2], // E string (low): root, 2nd, 3rd
        [4, 5, 6], // A string: 5th, 6th, 7th
        [2, 3, 4], // D string: 3rd, 4th, 5th
        [6, 0, 1], // G string: 7th, root, 2nd
        [4, 5, 6], // B string: 5th, 6th, 7th
        [2, 3, 4], // E string (high): 3rd, 4th, 5th
      ],
    },
    // E shape: root on E string (low)
    E: {
      position: 4,
      pattern: [
        [0, 1, 2], // E string (low): root, 2nd, 3rd
        [5, 6, 0], // A string: 6th, 7th, root
        [3, 4, 5], // D string: 4th, 5th, 6th
        [1, 2, 3], // G string: 2nd, 3rd, 4th
        [6, 0, 1], // B string: 7th, root, 2nd
        [3, 4, 5], // E string (high): 4th, 5th, 6th
      ],
    },
    // D shape: root on D string (string 2)
    D: {
      position: 5,
      pattern: [
        [5, 6, 0], // E string (low): 6th, 7th, root
        [3, 4, 5], // A string: 4th, 5th, 6th
        [0, 1, 2], // D string: root, 2nd, 3rd
        [5, 6, 0], // G string: 6th, 7th, root
        [3, 4], // B string: 4th, 5th (only 2 notes)
        [0, 1, 2], // E string (high): root, 2nd, 3rd
      ],
    },
  };

  // Process each string and assign CAGED positions
  for (let stringIndex = 0; stringIndex < strings.length; stringIndex++) {
    const str = strings[stringIndex];

    for (const semitone of str) {
      const scaleNote = scaleNotes.find(
        (sn) => sn.note.chroma === semitone.chroma
      );

      if (scaleNote) {
        const positions = [];

        // Find which scale degree this note is (0-based)
        const scaleDegreeIndex = scaleNotes.findIndex(
          (sn) => sn.note.chroma === semitone.chroma
        );

        // Check each CAGED shape to see if this scale degree appears on this string
        for (const shape of Object.values(cagedShapes)) {
          const stringPattern = shape.pattern[stringIndex];

          // For pentatonic scales (5 notes), we need to map 7-note patterns to 5-note patterns
          if (noteCount === 5) {
            // Map the scale degree to the pentatonic equivalent
            // Pentatonic uses degrees 0, 1, 2, 4, 5 (skipping 3 and 6 from major scale)
            // This is a simplified mapping - might need adjustment
            const pentatonicPattern = stringPattern
              .filter((d) => d !== 3 && d !== 6)
              .map((d) => (d > 3 ? d - 1 : d))
              .map((d) => (d > 5 ? d - 2 : d));

            if (pentatonicPattern.includes(scaleDegreeIndex % noteCount)) {
              positions.push(shape.position);
            }
          } else {
            // For 7-note scales, check directly
            if (stringPattern.includes(scaleDegreeIndex % noteCount)) {
              positions.push(shape.position);
            }
          }
        }

        semitone.positions = [...new Set(positions)].sort();
        semitone.interval = scaleNote.interval;
      }
    }
  }

  return strings;
}
