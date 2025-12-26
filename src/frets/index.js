import { Interval, Note } from "tonal";
import { getScaleNoteIntervalMap, getScaleNoteLabelMap } from '../lib/utils.js';
import pentatonic from './system/pentatonic.js';
import caged from './system/caged.js';

export default function frets(
  tuning = ["E2", "A2", "D3", "G3", "B3", "E4"],
  count = 13,
  scale,
  reverse = true
) {
  const processedTuning = reverse ? [...tuning].reverse() : tuning;
  const intervals = getScaleNoteIntervalMap(scale);
  const scaleNoteLabelMap = getScaleNoteLabelMap(scale);

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
        positions: {}, // Initialize empty positions object for systems to populate
      });
    }
    return notes;
  })

  // Apply position systems if a scale is provided
  if (scale && scale.intervals) {
    const noteCount = scale.intervals.length;

    // Apply pentatonic positions if it's a pentatonic scale
    if (noteCount === 5) {
      pentatonic(strings, scale);
    }

    // Apply CAGED positions for pentatonic (5 notes) or major/minor scales (7 notes)
    if (noteCount === 5 || noteCount === 7) {
      caged(strings, scale);
    }
  }

  function fb() {}

  fb.strings = strings;
  fb.tuning = tuning;
  fb.count =  count;

  return fb;
}