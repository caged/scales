<script>
  import { Chord, Range } from "tonal";
  import { Howler } from "howler";
  import { delay as pauseFor } from "./utils";
  import { getGuitarNotesHowl } from "./audioResources";

  export let notes = "";
  export let delay = 20;

  const sound = getGuitarNotesHowl();
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
