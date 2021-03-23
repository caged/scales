<script>
  import { onMount } from "svelte";
  import { scalePoint, range } from "d3";
  export let scale;

  let container;
  let width;
  let height;
  const margin = { top: 0, right: 20, bottom: 20, left: 20 };
  const dotX = scalePoint().domain(range(scale.notes().length));

  onMount(() => {
    width = container.clientWidth;
    height = 45;
    dotX.range([margin.left, width - margin.right]);
  });
</script>

{#if scale}
  <div bind:this={container}>
    {#if width}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        class="w-4 h-4"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clip-rule="evenodd"
        />
      </svg>
      <svg viewBox="0 0 {width} {height}">
        {#each scale.notes() as note, i}
          <g transform="translate({dotX(i)}, {20})">
            <circle
              r="12"
              fill={note.interval === "1P"
                ? "rgb(50, 50, 50)"
                : "rgb(87, 45, 146)"}
            />
            <text
              text-anchor="middle"
              dy="4"
              font-size="10"
              class="text-white"
              fill="currentColor">{note.name}</text
            >
            <text
              text-anchor="middle"
              dy="25"
              font-size="10"
              class="text-black"
              fill="currentColor">{note.interval}</text
            >
          </g>
        {/each}
      </svg>
    {/if}
  </div>
{/if}
