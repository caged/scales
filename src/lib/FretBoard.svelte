<script>
  import { onMount } from "svelte";
  import { scaleBand, scalePoint, scaleLinear } from "d3-scale";
  import { range } from "d3-array";
  import FretNote from "./FretNote.svelte";

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
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
    });

    resizeObserver.observe(containerRef);

    return () => {
      resizeObserver.disconnect();
    };
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
              transform="translate({fretX(stringNote.fret) +
                (fretX.bandwidth() / 2 - margin.left)}, 0)">
              <FretNote note={stringNote} />
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
</style>
