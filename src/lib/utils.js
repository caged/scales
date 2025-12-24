import { Note } from "tonal";

export const delay = (duration, value) => {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(value);
    }, duration);
  });
};

// Create a map of note names to their scale intervals
export function getScaleNoteIntervalMap(scale) {
  if (!scale || !scale.notes) return {};
  return scale.notes.reduce((map, note, index) => {
    map[note] = scale.intervals[index];
    return map;
  }, {});
}

// Create a map of note chromas to scale note names for label normalization
export function getScaleNoteLabelMap(scale) {
  if (!scale || !scale.notes) return {};
  return scale.notes.reduce((map, note) => {
    const noteObj = Note.get(note);
    map[noteObj.chroma] = note;
    return map;
  }, {});
}
