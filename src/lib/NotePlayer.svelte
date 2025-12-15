<script>
  import { Chord, Range } from "tonal";
  import { Howl, Howler } from "howler";
  import { delay as pauseFor } from "./utils";

  const guitarNotesUrl = "/guitar-notes.mp3";

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
    src: guitarNotesUrl,
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
    playNotes(notes);
  }
</script>
