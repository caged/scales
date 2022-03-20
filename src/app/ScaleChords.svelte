<script>
  import { Scale, Chord, Note, Midi } from "@tonaljs/tonal";
  import { createEventDispatcher, getContext } from "svelte";
  import { tonic, tuning } from "./store";

  export let scale;

  const lowestNote = Note.get($tuning[0]);
  const dispatch = createEventDispatcher();
  const { player } = getContext("app");

  function handleMouseUp(event) {
    const chordName = event.target.dataset.chord;
    const rootNote = Note.get(`${$tonic}${lowestNote.oct}`);
    const startNote =
      rootNote.height < lowestNote.height
        ? Note.get(`${rootNote.name}${rootNote.oct + 1}`)
        : rootNote;

    const chord = Chord.getChord(chordName, startNote);
    const midi = chord.notes.map(Midi.toMidi);
    player.play(midi, 15);

    dispatch("chordchange", chord);
  }
</script>

<ul class="text-xs text-gray-500 grid grid-cols-4 xl:grid-cols-8 gap-2">
  {#each Scale.scaleChords(scale.type()) as chordLabel}
    <li
      on:mouseup={handleMouseUp}
      class="px-2 py-1 overflow-hidden whitespace-nowrap rounded-full text-center bg-gray-200 hover:bg-purple-600 hover:text-white cursor-pointer"
      data-chord={chordLabel}
    >
      {chordLabel}
    </li>
  {/each}
</ul>
