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
      interval: intervals[i]
    };
  });

  // Find the root note (1P) to anchor positions
  const rootNote = scaleNotes.find(sn => sn.interval === "1P");
  if (!rootNote) {
    throw new Error("Scale must have a root note (1P)");
  }

  // Find the root note on the lowest string (low E, which is the last string in reversed array)
  // This anchors position 1 to the traditional starting position
  let rootFret = null;
  const lowestString = strings[strings.length - 1]; // Low E string

  for (const semitone of lowestString) {
    if (semitone.note.chroma === rootNote.note.chroma) {
      rootFret = semitone.fret;
      break; // Take the first occurrence on the low E string
    }
  }

  if (rootFret === null) {
    throw new Error("Could not find root note on lowest string");
  }

  // Define position boxes based on fret ranges relative to the root
  // Each position spans 4-5 frets with overlaps, positions repeat every 12 frets (octave)
  const getPositionForFret = (fret) => {
    // Calculate fret position relative to root, normalized to 0-11 range (one octave)
    const relativeToRoot = (fret - rootFret + 12) % 12;

    // Position boxes (relative to root fret):
    // Position 1: root + 0-3 semitones
    // Position 2: root + 2-5 semitones  (overlaps with 1)
    // Position 3: root + 4-7 semitones  (overlaps with 2)
    // Position 4: root + 7-10 semitones (overlaps with 3)
    // Position 5: root + 9-11 semitones and wraps to 0-1 (overlaps with 4 and 1)

    const positions = [];

    if (relativeToRoot >= 0 && relativeToRoot <= 3) positions.push(1);
    if (relativeToRoot >= 2 && relativeToRoot <= 5) positions.push(2);
    if (relativeToRoot >= 4 && relativeToRoot <= 7) positions.push(3);
    if (relativeToRoot >= 7 && relativeToRoot <= 10) positions.push(4);
    if (relativeToRoot >= 9 || relativeToRoot <= 1) positions.push(5);

    return positions;
  };

  for (const str of strings) {
    for (const semitone of str) {
      const scaleNote = scaleNotes.find((sn) => {
        return semitone.note.chroma === sn.note.chroma;
      });

      if (scaleNote) {
        // Assign positions based on fret location
        semitone.positions.Pentatonic = getPositionForFret(semitone.fret);
        semitone.interval = scaleNote.interval;
      }
    }
  }

  return strings;
}
