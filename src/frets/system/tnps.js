import { partition } from "../utils";

export default function tnps(strings, scale) {
  const numPositions = 7;
  const notesPerString = 3;
  const intervals = scale.intervals();
  const snotes = scale.notes();
  const scaleNotes = snotes.map((note, i) => {
    return {
      note,
      interval: intervals[i],
      name: note.name,
    };
  });

  const notesForString = (index) => {
    return partition(
      scaleNotes,
      notesPerString,
      numPositions,
      index * notesPerString
    );
  };

  for (const [strnum, str] of strings.entries()) {
    const strScalePositions = notesForString(strnum);

    for (const semitone of str) {
      const scaleNote = scaleNotes.find((sn) => {
        return semitone.chroma === sn.note.chroma;
      });

      const positions = strScalePositions
        .map((ssp, i) =>
          ssp.some((n) => n.note.chroma === semitone.chroma) ? i + 1 : -1
        )
        .filter((i) => i !== -1);

      if (scaleNote) {
        semitone.positions = positions;
        semitone.interval = scaleNote.interval;
      }
    }
  }

  return strings;
}
