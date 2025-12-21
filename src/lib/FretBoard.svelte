<script>
  import { onMount } from "svelte";
  import { scaleBand, scalePoint } from "d3-scale";
  import { range } from "d3-array";

  let { fretData } = $props();

  let containerRef = $state(null);
  let width = $state(0);
  let height = $state(0);

  let margin = { top: 40, right: 20, bottom: 20, left: 20 };

  let fretX = $derived(
    scaleBand()
      .domain(range(fretData.count))
      .range([margin.left, width - margin.right]),
  );

  let strY = $derived(
    scalePoint()
      .domain(range(fretData.tuning.length))
      .range([margin.top, height - margin.bottom]),
  );

  let fretCenterX = $derived((fret) => fretX(fret) + fretX.bandwidth() / 2);

  onMount(() => {
    width = containerRef.clientWidth;
    height = containerRef.clientHeight;
  });

  $effect(() => {
    console.log("fretData changed", fretData.strings);
  });
</script>

<div bind:this={containerRef} class="h-full w-full">
  {#if width}
    <svg viewBox="0 0 {width} {height}">
      {#each fretData.strings as notes, i}
        <g class="fb-string" transform="translate({margin.left}, {strY(i)})">
          <line
            x1={fretX(1) - margin.left}
            x2={width - margin.right - margin.left}
            class="stroke-gray-200" />
          {#each notes as stringNote}
            <g transform="translate({fretX(stringNote.fret)}, 0)">
              <g
                transform="translate({fretX.bandwidth() / 2 - margin.left}, 0)">
                <circle
                  dx="0"
                  r="12"
                  class="fill-amber-700 stroke-white stroke-2" />
                <text
                  dy="1"
                  font-size="10"
                  text-anchor="middle"
                  class="fill-white"
                  dominant-baseline="middle">{stringNote.note.letter}</text>
              </g>
            </g>
          {/each}
        </g>
      {/each}
      {#each fretX.domain() as fret}
        <g transform="translate({fretX(fret)}, {margin.top})">
          <text
            dx={fretX.bandwidth() / 2}
            dy={-10}
            class="fret-label"
            text-anchor="middle">{fret}</text>
          {#if fret > 0}
            <rect
              class="fret-line"
              x="0"
              y="0"
              width={1}
              height={height - margin.top - margin.bottom}></rect>
          {/if}
        </g>
      {/each}
    </svg>
  {/if}
</div>

<style>
  @reference "tailwindcss";

  .fret-label {
    @apply text-xs fill-gray-800 text-center -translate-y-2;
    text-anchor: middle;
    dominant-baseline: ideographic;
  }

  .fret-line {
    @apply fill-gray-200 stroke-0;
  }
</style>
