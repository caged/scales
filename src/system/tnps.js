import { partition } from "../utils";

export default function tnps(strings, scale) {
  strings = [...strings];
  const numPositions = 7;
  const notesPerString = 3;

  function tnps() {}

  const intervals = scale.intervals();
  const snotes = scale.notes();
  const scaleNotes = snotes.map((note, i) => {
    return {
      note,
      interval: intervals[i],
      name: note.name,
    };
  });

  const forString = (index) => {
    return partition(
      scaleNotes,
      notesPerString,
      numPositions,
      index * notesPerString
    );
  };

  let i = 0;
  for (const [strnum, str] of strings.entries()) {
    const strScalePositions = forString(strnum);
    console.log("\n");
    console.log(str[0].name, "String");
    for (const semitone of str) {
      semitone.positions = Date.now();
      semitone.i = i;
      semitone.positions = strScalePositions
        .map((ssp, spidx) => {
          const pos = ssp.some((n) => {
            return n.note.pc === semitone.pc;
          })
            ? spidx + 1
            : -1;
          return pos;
        })
        .filter((spidx) => spidx !== -1);
      if (strnum === 0)
        console.log(semitone.name, semitone.pc, semitone.positions);
      const snote = scaleNotes.find((sn) => semitone.pc === sn.note.pc);
      if (snote) {
        semitone.interval = snote.interval;
      }
    }
    i++;
  }

  console.log(strings[0][10]);

  return strings;
}
