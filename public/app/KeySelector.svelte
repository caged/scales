<script>
  import { tonic } from "./store";
  export let key;

  let note = key;
  let modifier = null;

  const notes = ["E", "F", "G", "A", "B", "C", "D"];

  $: key = [note, modifier].join("");
  $: tonic.set(key);

  function toggleEnabled(event) {
    if (modifier === event.target.value) modifier = null;
  }
</script>

<div class="flex items-center space-x-5">
  <div>
    <select name="note" bind:value={note} class="rounded-lg border-gray-300">
      {#each notes as note}
        <option value={note}>{note}</option>
      {/each}
    </select>
  </div>
  <div class="flex items-center">
    <input
      type="radio"
      bind:group={modifier}
      on:click={toggleEnabled}
      value="b"
      class="mr-1"
    />
    <span class="text-2xl">♭</span>
  </div>
  <div class="flex items-center">
    <input
      type="radio"
      bind:group={modifier}
      on:click={toggleEnabled}
      value="#"
      class="mr-1"
    />
    <span>#</span>
  </div>
</div>
