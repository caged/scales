import { Range } from "@tonaljs/tonal";
import { Howl } from "howler";
import { delay as pauseFor } from "./utils";

export default function player() {
  function player() {}

  let loaded = false;
  const noteRange = (sharps) =>
    Range.chromatic(["C1", "B5"], { sharps }).reduce((acc, cur, i) => {
      acc[cur] = [i * 2000, 2000];
      return acc;
    }, {});

  const sharps = noteRange(true);
  const flats = noteRange();
  const allNotes = { ...sharps, ...flats };

  var sound = new Howl({
    src: "guitar-notes.mp3",
    sprite: allNotes,
  });

  sound.on("load", () => {
    loaded = true;
  });

  player.volume = (vol) => sound.volume(vol);

  player.play = async function (notes, delay) {
    if (!loaded) console.error("Sound file not loaded...");

    const theNotes = [...notes];
    while (theNotes.length) {
      const note = theNotes.shift();

      sound.play(note.name);
      await pauseFor(delay);
    }
  };

  return player;
}
