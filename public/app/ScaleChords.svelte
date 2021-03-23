<script>
  import { Scale, Chord, Note } from "@tonaljs/tonal";
  import { createEventDispatcher } from "svelte";

  export let scale;
  export let tuning;

  const dispatch = createEventDispatcher();

  function handleMouseEnter(event) {
    const chordName = event.target.dataset.chord;
    const chord = Chord.getChord(
      chordName,
      Note.get(tuning[0]).height > Note.get(`${key}2`).height
        ? `${key}3`
        : `${key}2`
    );

    console.log(chord);
    dispatch("chordchange", chord);
  }

  function handleMouseLeave(event) {
    dispatch("chordchange", null);
  }
</script>

<ul
  class="text-xs text-gray-500 grid grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-2"
>
  {#each Scale.scaleChords(scale.type()) as chord}
    <li
      on:mouseenter={handleMouseEnter}
      on:mouseleave={handleMouseLeave}
      class="px-2 py-1 rounded-full text-center bg-gray-200 hover:bg-purple-600 hover:text-white cursor-pointer"
      data-chord={chord}
    >
      {chord}
    </li>
  {/each}
</ul>
