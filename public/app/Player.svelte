<script>
  import { Note } from "@tonaljs/tonal";

  import { getContext } from "svelte";
  import { tuning } from "./store";

  export let scale = null;
  export let volume = 0.5;

  const { player } = getContext("app");
  const lowestNote = Note.get($tuning[0]);

  $: player.volume(volume);

  function play(event) {
    const notes = scale.notes();
    const rootNote = Note.get(`${notes[0].name}${lowestNote.oct}`);
    const snote =
      rootNote.height < lowestNote.height
        ? Note.get(`${rooteNote.name}${rootNote.oct + 1}`)
        : rootNote;

    const notesWithOctaves = scale.notes().map((n) => {
      return Note.transpose(snote.name, n.interval);
    });

    console.log(notesWithOctaves);

    player.play(notesWithOctaves, 500);
  }
</script>

<div class="flex items-center">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    class="w-8 h-8 mt-1 mr-1 text-green-500 cursor-pointer"
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
  <div class="flex items-center">
    <input
      type="range"
      bind:value={volume}
      min={0}
      max={1}
      step={0.05}
      class="appearance-none h-2 mx-1 bg-gray-200 rounded"
    />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      class="w-4 h-4 text-gray-400"
    >
      <path
        fill-rule="evenodd"
        d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
        clip-rule="evenodd"
      />
    </svg>
  </div>
</div>
