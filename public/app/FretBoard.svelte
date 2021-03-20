<script>
  import { note, Scale } from "@tonaljs/tonal";
  import {
    scaleBand,
    scalePoint,
    scaleSequential,
    scaleLinear,
    range,
  } from "d3";
  import { interpolatePurples as interpolator } from "d3-scale-chromatic";
  import { frets, tnps } from "../dist/index";

  export let scale = null;
  export let system = tnps;
  export let position = null;

  const margin = { top: 45, right: 10, bottom: 35, left: 10 };
  const width = 1200;
  const height = 240;

  let fb, fbnotes, strings, fretX, strY, lineW;

  $: if (scale || position) {
    const sharps = scale.notes().some((n) => n.acc === "#");

    fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"], 2, sharps);
    fbnotes = fb.notes();
    strings = system(fbnotes, scale).reverse();

    fretX = scaleBand()
      .domain(range(fb.count() + 1))
      .range([margin.left, width - margin.right]);

    strY = scalePoint()
      .domain(range(fbnotes.length))
      .range([margin.top, height - margin.bottom]);

    lineW = scaleLinear().domain([0, strings.length]).range([1, 4]);
  }
</script>

<div>
  <svg viewBox="0 0 {width} {height}">
    {#each strings as str, i}
      <g transform="translate({margin.left}, {strY(i)})">
        <line
          x1={fretX(1)}
          x2={width - margin.right}
          stroke="currentColor"
          class="text-gray-100"
          stroke-width={lineW(i)}
        />
        {#each str as note, j}
          <g transform="translate({fretX(j)}, 0)">
            {#if j > 0}
              {#if !position || (position && note.positions && note.positions.includes(+position))}
                <circle
                  r="10"
                  stroke={note.interval ? "black" : "white"}
                  stroke-width="1"
                  fill={note.interval
                    ? note.interval === "1P"
                      ? "rgb(50, 50, 50)"
                      : "rgb(87, 45, 146)"
                    : "#fff"}
                />
              {/if}
            {/if}
            <text
              dy="1"
              class="{(note.interval && !position) ||
              (position && note.positions && note.positions.includes(+position))
                ? j == 0
                  ? 'text-purple-500'
                  : 'text-white'
                : 'text-gray-400'} {j == 0 ? 'font-bold' : 'font-normal'}"
              font-size="10"
              fill="currentColor"
              text-anchor="middle"
              dominant-baseline="middle">{note.pc.replace("b", "♭")}</text
            >
          </g>
        {/each}
      </g>
    {/each}
    {#each Array(fb.count()) as _, i}
      <g transform="translate({fretX(i + 1)}, {margin.top - 30})">
        <text
          dx="10"
          fill="currentColor"
          class="text-black"
          font-size="10"
          text-anchor="middle">{i + 1}</text
        >
        <rect
          rx="2"
          x={fretX.step() / 1.45}
          y="20"
          height={height - margin.bottom - 20}
          fill="currentColor"
          class={i + 1 === 11 ? "text-gray-900" : "text-gray-400"}
          width="3"
        />
        {#if ((i + 1) % 2 !== 0 && ![1, 11, 13].includes(i + 1)) || i + 1 == 12}
          <circle
            cx="10"
            cy={height - margin.bottom + 10}
            r="3"
            fill="currentColor"
            class="text-gray-400"
          />
        {/if}
      </g>
    {/each}
  </svg>
</div>
