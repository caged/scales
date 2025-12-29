<script>
  let { value = $bindable() } = $props();
  let notes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];
</script>

<select bind:value>
  {#each notes as note}
    <option value={note}>
      {note}
    </option>
  {/each}
</select>
