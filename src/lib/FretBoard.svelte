<script>
  import { onMount } from "svelte";
  import { scaleBand, scalePoint, scaleLinear } from "d3-scale";

  let { fretData } = $props();
  // let tuning = $derived(fretData?.tuning);
  // let count = $derived(fretData?.count);

  let width = $state(0);
  let height = $state(0);

  let containerRef;
  let margin = { top: 20, right: 20, bottom: 20, left: 20 };

  onMount(() => {
    width = containerRef.clientWidth;
    height = containerRef.clientHeight;

    // let fretX = scaleBand()
    //   .domain(fretData.count)
    //   .range([margin.left, width - margin.right])
    //   .padding(0.1);

    // console.log(fretX);
  });
</script>

<div bind:this={containerRef}>
  {#if fretData}
    <svg viewBox="0 0 {width} {height}">
      <g transform="translate(10, 20)">
        <text font-size="20">{fretData.tuning}</text>
      </g>
    </svg>
  {/if}
</div>
