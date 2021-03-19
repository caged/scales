<script>
  export let item = undefined;
  export let isFirst = false;
  export let isHover = false;
  export let isActive = false;
  export let getOptionLabel = () => item.name;
  export let getSelectionLabel = undefined
  export let filterText = item.name;
</script>

<style>
  .hover {
    @apply bg-gray-100;
  }
</style>

<div class="flex w-full items-center" class:hover={isHover} class:active={isActive} class:first={isFirst}>
  <div class="flex-1">{item.name}</div>
  {#if item.aliases.length > 0}
    <span class="text-xs text-gray-400">{item.aliases[0]}</span>
  {/if}
</div>