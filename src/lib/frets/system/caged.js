export default function caged(strings, scale) {
  if (scale.intervals().length !== 7)
    throw new Error("CAGED system only works with 7-note scales");

  const intervals = scale.intervals();
  const snotes = scale.notes();
  const scaleNotes = snotes.map((note, i) => {
    return {
      note,
      interval: intervals[i],
      name: note.name,
    };
  });

  // CAGED system divides the fretboard into 5 positions
  // Each position spans approximately 4-5 frets and contains 2-3 notes per string
  // The positions are based on the root note locations of the C, A, G, E, D chord shapes
  //
  // CAGED positions relative to root on low E string:
  // E shape: root on low E (fret 0 for E)
  // D shape: root 2 frets up from E shape
  // C shape: root 3 frets up from D shape (5 total from E)
  // A shape: root 2 frets up from C shape (7 total from E)
  // G shape: root 3 frets up from A shape (10 total from E)

  for (const str of strings) {
    for (let fretIndex = 0; fretIndex < str.length; fretIndex++) {
      const semitone = str[fretIndex];
      const scaleNote = scaleNotes.find((sn) => {
        return semitone.chroma === sn.note.chroma;
      });

      if (scaleNote) {
        const positions = [];

        // Determine which CAGED position this note belongs to based on fret location
        // Each position spans about 4-5 frets

        // Position boundaries (approximate fret ranges for standard tuning)
        // These are relative ranges that repeat every 12 frets
        const fretMod = fretIndex % 12;

        // E shape: around frets 0-4 (or 12-16, etc)
        if (fretMod >= 0 && fretMod <= 4) {
          positions.push(4); // Position 4 = E shape
        }

        // D shape: around frets 2-6
        if (fretMod >= 2 && fretMod <= 6) {
          positions.push(5); // Position 5 = D shape
        }

        // C shape: around frets 5-9
        if (fretMod >= 5 && fretMod <= 9) {
          positions.push(1); // Position 1 = C shape
        }

        // A shape: around frets 7-11
        if (fretMod >= 7 && fretMod <= 11) {
          positions.push(2); // Position 2 = A shape
        }

        // G shape: around frets 9-12 (0)
        if (fretMod >= 9 || fretMod <= 1) {
          positions.push(3); // Position 3 = G shape
        }

        semitone.positions = [...new Set(positions)].sort();
        semitone.interval = scaleNote.interval;
      }
    }
  }

  return strings;
}
