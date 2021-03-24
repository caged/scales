<script>
  import { Note } from "@tonaljs/tonal";

  import { getContext } from "svelte";
  import { tuning } from "./store";

  export let scale;
  export let position;
  export let chord;

  const { player } = getContext("app");

  function play(event) {
    const notesWithOctaves = scale.notes().map((n) => {
      const name = n.name;
      return Note.get($tuning[0]).height > Note.get(`${name}2`).height
        ? `${name}3`
        : `${name}2`;
    });

    player.play(notesWithOctaves, 500);
  }
</script>

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
