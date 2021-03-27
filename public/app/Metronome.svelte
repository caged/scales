<script>
  import { Howl } from "howler";
  import { delay } from "./utils";

  let volume = 1;
  let bpm = 120;
  let playing = false;

  var sound = new Howl({
    src: "metronome.mp3",
    sprite: {
      a: [0, 500],
      b: [500, 500],
      c: [1000, 500],
      d: [1500, 500],
    },
  });

  async function play(event) {
    playing = !playing;
    while (!!playing) {
      console.log("play");
      sound.play("d");
      await delay((60 / bpm) * 1000);
    }
  }
</script>

<div class="flex items-center">
  {#if !playing}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="w-6 h-6 mt-1 mr-1 text-green-500 cursor-pointer"
      on:mouseup={play}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  {:else}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="w-6 h-6 mt-1 mr-1 text-red-500 cursor-pointer"
      on:mouseup={play}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
      />
    </svg>
  {/if}
  <div class="-mt-1">
    <input
      type="range"
      bind:value={bpm}
      min={40}
      max={240}
      step={1}
      class="appearance-none h-1 w-20 xl:w-32 mx-1 bg-gray-200 "
    />
    <span class="whitespace-nowrap">
      <span class="font-mono text-xs">{bpm}</span>
      <label for="bmp" class="text-xs text-gray-500 inline-block">BPM</label>
    </span>
  </div>
</div>
