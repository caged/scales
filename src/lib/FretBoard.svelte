<script>
  import { onMount } from "svelte";
  import { scaleBand, scalePoint, scaleLinear } from "d3-scale";
  import { range } from "d3-array";
  import { Note } from "tonal";

  let { fretData } = $props();

  let containerRef = $state(null);
  let width = $state(0);
  let height = $state(0);

  let margin = { top: 40, right: 20, bottom: 20, left: 0 };

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

  let lineW = $derived(
    scaleLinear().domain([0, fretData.strings.length]).range([1, 4]),
  );

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
            class="stroke-gray-100"
            stroke-width={lineW(i)} />
          {#each notes as stringNote}
            <g
              data-interval={stringNote.interval}
              data-in-scale={!!stringNote.interval}
              data-fret={stringNote.fret}
              class:in-scale={!!stringNote.interval}
              transform="translate({fretX(stringNote.fret)}, 0)"
              class="fret-note">
              <g
                transform="translate({fretX.bandwidth() / 2 - margin.left}, 0)">
                {#if stringNote.fret > 0}
                  <circle class="fret-note-background" dx="0" r="12" />
                {/if}

                <text
                  dy="1"
                  font-size="10"
                  text-anchor="middle"
                  class="fret-note-text"
                  dominant-baseline="middle">{stringNote.label}</text>
              </g>
            </g>
          {/each}
        </g>
      {/each}
      <!-- draw frets and fret numbers -->
      {#each fretX.domain() as fret}
        <g transform="translate({fretX(fret)}, {margin.top})">
          {#if fret > 0}
            <text
              dx={fretX.bandwidth() / 2}
              dy={-10}
              class="fret-label"
              text-anchor="middle">{fret}</text>
            <rect
              class="fret-line"
              x="0"
              y="0"
              width={fret == 1 ? 8 : 2}
              height={height - margin.top - margin.bottom}></rect>
          {/if}
        </g>
        <g
          transform="translate({fretX(fretData.count - 1) +
            fretX.bandwidth()}, {margin.top})">
          <rect
            class="fret-line"
            x="0"
            y="0"
            width={2}
            height={height - margin.top - margin.bottom}></rect>
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
    @apply fill-gray-400 stroke-0;
  }

  .fret-note-background {
    @apply fill-white;
  }

  .fret-note-label {
    @apply text-sm fill-gray-800;
  }

  .fret-note[data-fret="0"].in-scale .fret-note-text {
    @apply fill-green-500;
  }

  .in-scale .fret-note-background {
    @apply fill-green-600;
  }

  .in-scale .fret-note-text {
    @apply fill-white font-bold;
  }

  .in-scale[data-interval="1P"] circle {
    @apply fill-green-800 stroke-emerald-900;
  }
</style>
