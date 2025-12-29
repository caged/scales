<script>
  let { value = $bindable() } = $props();

  let scales = [
    "major",
    "minor",
    "major pentatonic",
    "minor pentatonic",
    "dorian",
    "phrygian",
    "lydian",
    "mixolydian",
    "locrian",
    "blues",
    "harmonic minor",
    "melodic minor",
  ];
</script>

<select bind:value>
  {#each scales as scale}
    <option value={scale}>
      {scale}
    </option>
  {/each}
</select>

<style>
  select {
    text-transform: capitalize;
  }
</style>
