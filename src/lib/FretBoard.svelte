<script>
  let { fretData } = $props();

  let tuning = $derived(fretData?.tuning);
</script>

<div>
  {#each tuning as note}
    <div>{note}</div>
  {/each}
</div>
