<script>
  import { tuning, tonic, scale, bpm } from "./store";
  import { Scale, Chord, Note, Midi } from "@tonaljs/tonal";
  import { createEventDispatcher, getContext } from "svelte";
  import { delay } from "./utils";

  const lowestNote = Note.get($tuning[0]);
  const dispatch = createEventDispatcher();
  const { player } = getContext("app");

  let progression = `Am F G Am\nAm F C G`;

  async function playProgression() {
    const progressions = progression.split("\n");
    for (const progression of progressions) {
      const chords = progression.split(" ");

      while (chords.length > 0) {
        const chordLabel = chords.shift();
        const note = /^([ABCDEFG][b|#]?)(.+?)?$/m;
        const [_, noteName, chordName] = chordLabel.match(note);
        let rootNote = Note.get(`${noteName}${lowestNote.oct}`);
        while (rootNote.height < lowestNote.height) {
          rootNote = Note.get(`${rootNote.pc}${rootNote.oct + 1}`);
        }

        const chord = Chord.getChord(chordName || "M", rootNote);
        const midi = chord.notes.map(Midi.toMidi);

        await player.play(midi, 15);
        await delay((60 / $bpm) * 1000 * 4);
      }
    }
  }
</script>

<div>
  <textarea bind:value={progression} />
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    class="w-6 h-6 mr-1"
    on:click={playProgression}
  >
    <path
      fill-rule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clip-rule="evenodd"
    />
  </svg>
</div>
