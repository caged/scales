import { Scale, Note } from "@tonaljs/tonal";

export default function scale(name) {
  const s = Scale.get(name);
  function scale() {}

  // name is reserved.  In what is probably a poor decision, use
  // defineProperty to hammer this into place
  Object.defineProperty(scale, "name", {
    value: () => s.name,
    writable: false,
  });

  // Delegate most of the methods to Tonal's Scale object
  scale.setNum = () => s.setNum;
  scale.chroma = () => s.chroma;
  scale.normalized = () => s.normalized;
  scale.intervals = () => s.intervals;
  scale.aliases = () => s.aliases;
  scale.type = () => s.type;
  scale.tonic = () => s.tonic;
  scale.notes = () => {
    const intervals = s.intervals;
    return s.notes.map((n, i) => {
      return Object.assign(Note.get(n), {
        interval: intervals[i],
      });
    });
  };

  return scale;
}
