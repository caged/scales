<script>
  import { Scale } from "@tonaljs/tonal";
  import { createEventDispatcher } from "svelte";

  export let scale;

  const dispatch = createEventDispatcher();

  function handleMouseEnter(event) {
    const chord = event.target.dataset.chord;
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
