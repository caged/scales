import { Interval, Note } from "tonal";

export default function frets(
  tuning = ["E2", "A2", "D3", "G3", "B3", "E4"],
  count = 12
) {

  const allNotes = tuning.map((string, stringIndex) => {
    const notes = [];
    for (let fret = 0; fret <= count; fret++) {
      const note = Note.transpose(string, Interval.fromSemitones(fret));
      notes.push({
        note: Note.get(note),
        string: stringIndex,
        fret
      });
    }
    return notes;
  })

  function fb() {}

  fb.notes = allNotes;
  fb.tuning = tuning;
  fb.count =  count;

  return fb;
}