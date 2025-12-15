import { delay as pauseFor } from "./utils";
import { getGuitarNotesHowl, NOTE_CRESCENDO_URL } from "./audioResources";

const noteCrescendoUrl = NOTE_CRESCENDO_URL;

export default function player() {
  function player() {}

  const sound = getGuitarNotesHowl();
  let loaded = false;

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
