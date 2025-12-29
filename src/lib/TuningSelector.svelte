<script>
  import { tunings } from "$lib";

  let { value = $bindable() } = $props();
</script>

<select bind:value name="tuning">
  {#each tunings as [name]}
    <option value={name}>{name}</option>
  {/each}
</select>
