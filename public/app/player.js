import { Range } from "@tonaljs/tonal";
import { Howl } from "howler";
import { delay as pauseFor } from "./utils";

export default function player() {
  function player() {}

  let loaded = false;
  const midiRange = Range.numeric(["C1", "B5"]).reduce((acc, cur, i) => {
    acc[cur] = [i * 2000, 2000];
    return acc;
  }, {});

  console.log(midiRange);

  var sound = new Howl({
    src: "guitar-notes.mp3",
    sprite: midiRange,
  });

  sound.on("load", () => {
    loaded = true;
  });

  player.volume = (vol) => sound.volume(vol);

  player.play = async function (midi, delay) {
    if (!loaded) console.error("Sound file not loaded...");

    const notes = [...midi].map(String);
    while (notes.length) {
      const note = notes.shift();
      sound.play(note);
      await pauseFor(delay);
    }
  };

  return player;
}
