<script>
  export let system;
  export let position = null;

  const positions = 7;

  function toggleEnabled(event) {
    const { target } = event;
    if (position === +target.value) {
      position = null;
      target.checked = false;
    }
  }
</script>

<div class="flex space-x-5">
  {#each { length: positions } as _, i}
    <div class="flex flex-col text-center">
      <input
        bind:group={position}
        type="radio"
        value={i + 1}
        on:click={toggleEnabled}
      />
      <span class="mt-1 text-xs">{i + 1}</span>
    </div>
  {/each}
</div>
