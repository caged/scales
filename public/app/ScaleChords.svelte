<script>
  import { Scale, Chord, Note } from "@tonaljs/tonal";
  import { createEventDispatcher, getContext } from "svelte";
  import { tonic, tuning } from "./store";

  export let scale;

  const dispatch = createEventDispatcher();
  const { player } = getContext("app");

  function handleMouseUp(event) {
    const chordName = event.target.dataset.chord;
    const chord = Chord.getChord(
      chordName,
      Note.get($tuning[0]).height > Note.get(`${$tonic}2`).height
        ? `${$tonic}3`
        : `${$tonic}2`
    );

    player.play(chord.notes);

    dispatch("chordchange", chord);
  }
</script>

<ul
  class="text-xs text-gray-500 grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2"
>
  {#each Scale.scaleChords(scale.type()) as chordLabel}
    <li
      on:mouseup={handleMouseUp}
      class="px-2 py-1 rounded-full text-center bg-gray-200 hover:bg-purple-600 hover:text-white cursor-pointer"
      data-chord={chordLabel}
    >
      {chordLabel}
    </li>
  {/each}
</ul>
