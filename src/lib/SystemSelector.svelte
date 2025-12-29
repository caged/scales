<script>
  import { cagedPositionMapping } from "../frets/system/patterns.js";
  let { system = $bindable(), position = $bindable() } = $props();

  // Get position key for CAGED in correct letter order
  let cagedMap = "CAGED".split("").map((char) => {
    return Object.entries(cagedPositionMapping).find(
      ([, label]) => label === char,
    );
  });
</script>

<div class="flex gap-5">
  <div>
    <select bind:value={system} class="w-fit border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
      <option value="CAGED">CAGED</option>
      <option value="Pentatonic">Pentatonic</option>
    </select>
  </div>

  <div class="flex items-center space-x-2">
    {#if system === "CAGED"}
      {#each cagedMap as [pos, label]}
        <label
          ><input
            type="radio"
            name="position"
            bind:group={position}
            value={parseInt(pos)} />
          <span>{label}</span></label>
      {/each}
    {:else if system === "Pentatonic"}
      {#each Array(5) as _, index}
        <label
          ><input
            type="radio"
            name="position"
            bind:group={position}
            value={index + 1} />
          <span>{index + 1}</span></label>
      {/each}
    {/if}
  </div>
</div>

<style>
  @reference "tailwindcss";

  input[type="radio"] {
    @apply border-gray-400 checked:bg-sky-600 checked:border-sky-600 active:bg-sky-200 focus:ring-1 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-500 dark:active:bg-sky-700;
  }

  label {
    @apply flex-col flex gap-1 items-center justify-center text-xs font-bold;
  }
</style>
