import { Howl } from "howler";
import { Range } from "@tonaljs/tonal";
import { delay as pauseFor } from "./utils";
import noteCrescendoUrl from "../note-crescendo.mp3?url";

export default function player() {
  function player() {}

  let loaded = false;
  const midiRange = Range.numeric(["C1", "E6"]).reduce((acc, cur, i) => {
    acc[cur] = [i * 2000, 2000];
    return acc;
  }, {});

  var sound = new Howl({
    src: noteCrescendoUrl,
    sprite: midiRange,
  });

  sound.on("load", async () => {
    loaded = true;
  });

  player.volume = (vol) => sound.volume(vol);

  player.play = async function (midi, delay = 0) {
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
