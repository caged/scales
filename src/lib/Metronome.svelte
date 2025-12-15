<script>
  import { Howl } from "howler";
  import { delay } from "./utils";
  import Volume from "./Volume.svelte";
  import { bpm } from "./store";
  import { METRONOME_URL } from "./audioResources";

  let volume = 0.5;
  let playing = false;

  var sound = new Howl({
    src: METRONOME_URL,
    sprite: {
      a: [0, 500],
      b: [500, 500],
      c: [1000, 500],
      d: [1500, 500],
    },
  });

  $: sound.volume(volume);
  $: bpm.set($bpm);

  async function play(event) {
    playing = !playing;
    while (!!playing) {
      sound.play("d");
      await delay((60 / $bpm) * 1000);
    }
  }
</script>

<div>
  <div class="flex items-center  justify-center mx-auto mb-1">
    <input
      type="number"
      min={10}
      max={300}
      bind:value={$bpm}
      class="p-0 m-0 w-auto appearance-none border-none  text-4xl text-gray-800"
    />
    <label for="bmp" class="text-sm ml-1 text-gray-500">BPM</label>
  </div>
  <div class="flex items-center space-x-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      class="w-6 h-6"
      class:text-green-500={playing}
      on:click={play}
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div>
      <Volume bind:volume />
    </div>
  </div>
</div>
