<script>
  import { onMount } from "svelte";
  import { scalePoint, range } from "d3";
  import { Note } from "tonal";

  let { scale } = $props();

  let container = $state(null);
  let width = $state(0);
  let height = $state(45);

  const margin = { top: 0, right: 20, bottom: 20, left: 20 };
  const dotX = $derived(
    scalePoint()
      .domain(range(scale.notes.length))
      .range([margin.left, width - margin.right]),
  );

  const notes = $derived(scale.notes.map((n) => Note.get(n)));

  onMount(() => {
    width = container.clientWidth;
    height = 45;
  });
</script>

<div class="w-full h-full" bind:this={container}>
  <svg class="h-12" viewBox="0 0 {width} {height}">
    {#each notes as note, i}
      <g transform="translate({dotX(i)}, {20})">
        <circle
          r="12"
          class={note.interval === "1P" ? "fill-red-500" : "fill-green-500"} />
        <text
          text-anchor="middle"
          dy="4"
          font-size="10"
          class="text-white"
          fill="currentColor">{note.name}</text>
        <text
          text-anchor="middle"
          dy="25"
          font-size="10"
          class="text-black"
          fill="currentColor">{scale.intervals[i]}</text>
      </g>
    {/each}
  </svg>
</div>
