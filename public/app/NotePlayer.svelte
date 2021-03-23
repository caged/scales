<script>
  import { Chord, Range } from "@tonaljs/tonal";
  import { Howl, Howler } from "howler";
  import { delay as pauseFor } from "./utils";

  export let notes = "";
  export let delay = 20;

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
  sound.volume(0.2);

  async function playNotes(notes) {
    const theNotes = [...notes];
    while (theNotes.length) {
      const note = theNotes.shift();

      sound.play(note.name);
      await pauseFor(delay);
    }
  }

  $: {
    console.log(
      "Play notes",
      notes.map((n) => n.name)
    );
    playNotes(notes);
  }

  // sound.on("load", async (event) => {
  //   while (notes.length) {
  //     const note = notes.shift();
  //     console.log(note);
  //     sound.play(note);
  //     await delay(50);
  //   }
  //   // console.log(sound);
  //   // ["A2", "E3", "C3"].forEach((n) => {
  //   //   sound.play(n);
  //   // });
  // });
</script>
