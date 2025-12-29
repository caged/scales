<script>
  import { tunings } from "$lib";

  let { value = $bindable() } = $props();
</script>

<select bind:value name="tuning" class="w-full border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100">
  {#each tunings as [name]}
    <option value={name}>{name}</option>
  {/each}
</select>
