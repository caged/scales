<script>
  let { system = $bindable(), position = $bindable() } = $props();
</script>

<div class="flex gap-5">
  <div>
    <select bind:value={system} class="w-fit border border-gray-200">
      <option value="CAGED">CAGED</option>
      <option value="3NPS">3NPS</option>
      <option value="Pentatonic">Pentatonic</option>
    </select>
  </div>

  <div class="flex items-center space-x-2">
    {#if system === "CAGED"}
      <label
        ><input type="radio" name="position" bind:group={position} value={1} />
        <span>C</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={2} />
        <span>A</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={3} />
        <span>G</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={4} />
        <span>E</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={5} />
        <span>D</span></label>
    {:else if system === "3NPS"}
      <label
        ><input type="radio" name="position" bind:group={position} value={1} />
        <span>1</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={2} />
        <span>2</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={3} />
        <span>3</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={4} />
        <span>4</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={5} />
        <span>5</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={6} />
        <span>6</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={7} />
        <span>7</span></label>
    {:else if system === "Pentatonic"}
      <label
        ><input type="radio" name="position" bind:group={position} value={1} />
        <span>1</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={2} />
        <span>2</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={3} />
        <span>3</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={4} />
        <span>4</span></label>
      <label
        ><input type="radio" name="position" bind:group={position} value={5} />
        <span>5</span></label>
    {/if}
  </div>
</div>

<style>
  @reference "tailwindcss";

  input[type="radio"] {
    @apply border-gray-400 checked:bg-sky-600 checked:border-sky-600 active:bg-sky-200 focus:ring-1 focus:ring-sky-500;
  }

  label {
    @apply flex-col flex gap-1 items-center justify-center text-xs font-bold;
  }
</style>
