<script>
  export let value;

  const systems = [
    { name: "tnps", label: "3 Notes Per String" },
    { name: "caged", label: "CAGED" },
    { name: "pentatonic", label: "Pentatonic" }
  ];
</script>

<select bind:value class="border border-gray-300 rounded px-3 py-1">
  {#each systems as system}
    <option value={system.name}>{system.label}</option>
  {/each}
</select>
