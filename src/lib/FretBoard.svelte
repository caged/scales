<script>
  import { onMount } from "svelte";
  import { scaleBand, scalePoint, scaleLinear } from "d3-scale";
  import { range } from "d3-array";

  let { fretData } = $props();

  let containerRef = $state(null);
  let width = $derived(containerRef.clientWidth);
  let height = $derived(containerRef.clientHeight);

  let fretX;
  let strY;
  let margin = { top: 20, right: 20, bottom: 20, left: 20 };

  // onMount(() => {
  //   width = containerRef.clientWidth;
  //   height = containerRef.clientHeight;

  //   fretX = scaleBand()
  //     .domain(range(fretData.count))
  //     .range([margin.left, width - margin.right])
  //     .padding(0.1);

  //   strY = scalePoint()
  //     .domain(range(fretData.tuning.length))
  //     .range([margin.top, height - margin.bottom]);
  // });
</script>

<div bind:this={containerRef}>
  {#if width && height}
    <svg viewBox="0 0 {width} {height}"> </svg>
  {/if}
</div>
