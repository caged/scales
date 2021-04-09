<script>
  import { getContext } from "svelte";
  import { scaleBand, scalePoint, scaleLinear, range } from "d3";
  import { frets, tnps, chunk } from "../dist/index";
  import { delay } from "./utils";
  import { bpm } from "./store";

  export let scale = null;
  export let system = tnps;
  export let position = null;
  export let tuning;
  export let notes = null;

  const { player } = getContext("app");
  const margin = { top: 45, right: 10, bottom: 35, left: 10 };
  const width = 1200;
  let defaultHeight = 240;
  let height;
  let fb, fbnotes, strings, fretX, strY, lineW;

  const getsFretMarker = (i) =>
    ((i + 1) % 2 !== 0 && ![1, 11, 13].includes(i + 1)) || i + 1 == 12;

  const noteInPosition = (note, position) =>
    position && note.positions && note.positions.includes(+position);

  const classesForNote = (note, notes) => {
    const names = notes.map((n) => n.name);
    if (note.interval === "1P") {
      return names.includes(note.name) ? "text-pink-700" : "text-black";
    }

    if (note.interval) {
      return names.includes(note.name) ? "text-gray-600" : "text-purple-800";
    }

    return "text-white";
  };

  async function play(n) {
    console.log(n);
    await player.play([n.midi]);
  }

  async function playNotes(event) {
    const nstrings = strings.map((s) =>
      s
        .filter((n) => {
          return noteInPosition(n, position);
        })
        .map((n) => {
          return n.midi;
        })
    );

    let o1 = [];
    let o2 = [];

    console.log(nstrings);

    nstrings.forEach((s) => {
      o1 = o1.concat(s.slice(0, 3).reverse());
      o2 = o2.concat(s.slice(3).reverse());
    });

    while (o1.length > 0) {
      const n = o1.pop();
      await delay((60 / $bpm) * 1000);
      await player.play([n]);
    }
  }

  $: if ((scale || position) && tuning) {
    const sharps = scale.notes().some((n) => n.acc === "#");
    height = defaultHeight + (tuning.length - 6) * 32;

    fb = frets(tuning, 2, sharps);
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
  <div class="flex items-center mt-2 ml-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="w-6 h-6 mr-1"
      on:click={playNotes}
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
        clip-rule="evenodd"
      />
    </svg>
    Play notes
  </div>
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
          <g transform="translate({fretX(j)}, 0)" on:click={() => play(note)}>
            {#if j > 0}
              {#if !position || noteInPosition(note, position)}
                <circle
                  r="10"
                  fill="currentColor"
                  class={classesForNote(note, notes)}
                />
              {:else if noteInPosition(note, position === 7 ? 1 : position + 1) || noteInPosition(note, position === 1 ? 7 : position - 1)}
                <circle r="10" fill="currentColor" class="text-gray-200" />
              {/if}
            {/if}
            <text
              dy="1"
              class="{(note.interval && !position) ||
              noteInPosition(note, position)
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
        {#if getsFretMarker(i)}
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

<style>
  .chord {
    @apply font-bold bg-pink-500 text-pink-500;
  }
</style>
