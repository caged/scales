<script>
  import { Scale } from "@tonaljs/tonal";
  import {
    scaleBand,
    scalePoint,
    scaleSequential,
    scaleOrdinal,
    scaleLinear,
    range,
  } from "d3";
  import { interpolatePurples as interpolator } from "d3-scale-chromatic";
  import { frets, scale as createScale, tnps } from "../dist/index";

  export let scaleName = "";

  const margin = { top: 45, right: 10, bottom: 35, left: 10 };
  const width = 1200;
  const height = 240;
  const dotR = 24;
  const minorW = width / 4;

  let fb,
    fbnotes,
    scale,
    scaleLen,
    strings,
    fretX,
    strY,
    dotX,
    color,
    colorFixed,
    lineW;

  $: if (scaleName) {
    fb = frets(["E2", "A2", "D3", "G3", "B3", "E4"]);
    scale = createScale(scaleName);
    fbnotes = fb.notes();
    strings = tnps(fbnotes, scale).reverse();
    scaleLen = scale.notes().length;

    fretX = scaleBand()
      .domain(range(fb.count() + 1))
      .range([margin.left, width - margin.right]);

    strY = scalePoint()
      .domain(range(fbnotes.length))
      .range([margin.top, height - margin.bottom]);

    dotX = scalePoint()
      .domain(range(scale.notes().length))
      .range([20, minorW - 20]);

    color = scaleSequential(interpolator).domain([0, scaleLen]);

    colorFixed = scaleOrdinal()
      .domain(scale.notes().map((n) => n.name))
      .range(range(scaleLen).map(color));

    lineW = scaleLinear().domain([0, strings.length]).range([1, 4]);
  }
</script>

<div>
  {#if scale}
    <div class="flex mb-10 border-b border-gray-300">
      <div class="p-5">
        <svg viewBox="0 0 {minorW} {dotR * 2}" width={minorW}>
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
                font-size="8"
                class="text-black"
                fill="currentColor">{note.interval}</text
              >
            </g>
          {/each}
        </svg>
      </div>
      <div class="flex-1 p-5">
        <h3 class="font-bold">Forms the foundation of the scales</h3>
        <span class="text-gray-600">{Scale.extended(scaleName).join(", ")}</span
        >
      </div>
      <div class="flex-1 p-5">
        <h3 class="font-bold">Contains the scales</h3>
        <span class="text-gray-600">{Scale.reduced(scaleName).join(", ")}</span>
      </div>
    </div>
  {/if}

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
            <text
              dy="1"
              class="{note.interval
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
