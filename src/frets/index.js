import { Interval, Note, Scale } from "tonal";

function getScaleNoteIntervalMap(scale) {
  return scale.notes.reduce((map, note, index) => {
    map[note] = scale.intervals[index];
    return map;
  }, {});
}

// Create a map of note chromas to scale note names for label normalization
function getScaleNoteLabelMap(scale) {
  return scale.notes.reduce((map, note) => {
    const noteObj = Note.get(note);
    map[noteObj.chroma] = note;
    return map;
  }, {});
}

export default function frets(
  tuning = ["E2", "A2", "D3", "G3", "B3", "E4"],
  count = 13,
  scale,
  reverse = true
) {
  const scaleObj = Scale.get(scale);
  const processedTuning = reverse ? [...tuning].reverse() : tuning;
  const intervals = getScaleNoteIntervalMap(scaleObj);
  const scaleNoteLabelMap = getScaleNoteLabelMap(scaleObj);

  const strings = processedTuning.map((string, stringIndex) => {
    const notes = [];
    for (let fret = 0; fret < count; fret++) {
      const noteVal = Note.transpose(string, Interval.fromSemitones(fret));
      const noteObject = Note.get(noteVal);

      // Use the scale's note name if this chroma is in the scale
      const label = scaleNoteLabelMap[noteObject.chroma] || noteObject.pc;

      notes.push({
        note: noteObject,
        string: stringIndex,
        interval: intervals[label] || null,
        label: label.replace("b", "♭").replace("#", "♯"),
        fret,
      });
    }
    return notes;
  })

  function fb() {}

  fb.strings = strings;
  fb.tuning = tuning;
  fb.count =  count;

  return fb;
}