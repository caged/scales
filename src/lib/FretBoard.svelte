<script>
  import { onMount } from "svelte";
  import { scaleBand, scalePoint, scaleLinear } from "d3-scale";
  import { range } from "d3-array";

  let { fretData } = $props();

  let containerRef = $state(null);
  let width = $state(0);
  let height = $state(0);

  let margin = { top: 20, right: 20, bottom: 20, left: 20 };

  let fretX = $derived(
    scaleBand()
      .domain(range(fretData.count))
      .range([margin.left, width - margin.right])
      .padding(0.1),
  );

  let strY = $derived(
    scalePoint()
      .domain(range(fretData.tuning.length))
      .range([margin.top, height - margin.bottom]),
  );

  onMount(() => {
    width = containerRef.clientWidth;
    height = containerRef.clientHeight;
  });
</script>

<div bind:this={containerRef} class="h-full w-full">
  {#if width}
    <svg viewBox="0 0 {width} {height}">
      {#each fretX.domain() as fret}
        <g transform="translate({fretX(fret)}, {margin.top})">
          <text class="fret-label">{fret}</text>
          <rect
            class="fret-line"
            x="0"
            y="0"
            width={1}
            height={height - margin.top - margin.bottom}></rect>
        </g>
      {/each}
    </svg>
  {/if}
</div>

<style>
  @reference "tailwindcss";

  .fret-label {
    @apply text-sm font-bold fill-gray-800 text-center;
    text-anchor: middle;
    dominant-baseline: ideographic;
  }

  .fret-line {
    @apply fill-gray-200 stroke-0;
  }
</style>
