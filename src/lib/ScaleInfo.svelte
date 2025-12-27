<script>
  import { onMount } from "svelte";
  import { scalePoint, range } from "d3";
  import { Note } from "tonal";
  import FretNote from "./FretNote.svelte";

  let { scale } = $props();

  let notes = $derived(
    scale.notes.map((note, index) => {
      const noteObj = Note.get(note);
      return {
        ...noteObj,
        label: noteObj.name.replace("b", "♭").replace("#", "♯"),
        interval: scale.intervals[index],
      };
    }),
  );

  let container = $state(null);
  let width = $state(0);
  let height = $state(45);

  const margin = { top: 0, right: 20, bottom: 20, left: 20 };
  const dotX = $derived(
    scalePoint()
      .domain(range(scale.notes.length))
      .range([margin.left, width - margin.right]),
  );

  onMount(() => {
    width = container.clientWidth;
    height = 45;
  });
</script>

<div class="w-full h-full" bind:this={container}>
  <svg class="h-12" viewBox="0 0 {width} {height}">
    {#each notes as note, i}
      <g transform="translate({dotX(i)}, {20})">
        <FretNote {note} />
        <text
          text-anchor="middle"
          dy="25"
          font-size="10"
          class="text-black"
          fill="currentColor">{note.interval}</text>
      </g>
    {/each}
  </svg>
</div>
