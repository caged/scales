<script>
  import { Scale, Chord, Note, Midi } from "tonal";
  import { getContext } from "svelte";
  import { tonic, tuning } from "./store";

  let { scale, onchordchange } = $props();

  const lowestNote = Note.get($tuning[0]);
  const { player } = getContext("app");

  function handleMouseUp(event) {
    const chordName = event.target.dataset.chord;
    const rootNote = Note.get(
      `${$tonic}${$tonic === "C" ? lowestNote.oct + 1 : lowestNote.oct}`,
    );
    const startNote =
      rootNote.height < lowestNote.height
        ? Note.get(`${rootNote.name}${rootNote.oct + 1}`)
        : rootNote;

    const chord = Chord.getChord(chordName, startNote);
    const notesWithOctaves = Chord.notes(chordName, startNote);
    const midi = notesWithOctaves.map(Midi.toMidi);
    player.play(midi, 15);

    onchordchange?.(chord);
  }
</script>

<ul class="text-xs text-gray-500 grid grid-cols-6 xl:grid-cols-8 gap-2">
  {#each Scale.scaleChords(scale.type()) as chordLabel}
    <li
      on:mouseup={handleMouseUp}
      class="px-2 py-1 overflow-hidden whitespace-nowrap text-center bg-gray-200 hover:bg-purple-600 hover:text-white cursor-pointer"
      data-chord={chordLabel}
    >
      {chordLabel}
    </li>
  {/each}
</ul>
