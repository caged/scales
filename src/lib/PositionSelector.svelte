<script>
  export let scale;
  export let position = null;

  $: positions = scale.intervals().length;

  function toggleEnabled(event) {
    const { target } = event;
    if (position === +target.value) {
      position = null;
      target.checked = false;
    }
  }

  function isSurroundingPosition(cur, pos) {
    if (!pos) return false;

    if (pos - 1 === 0) {
      return cur === positions || cur === pos + 1;
    }

    if (pos + 1 > positions) {
      return cur === 1 || cur === pos - 1;
    }

    return cur === pos - 1 || cur === pos + 1;
  }
</script>

<div class="flex space-x-5">
  {#each { length: positions } as _, i}
    <div class="flex flex-col items-center text-center">
      <input
        bind:group={position}
        type="radio"
        value={i + 1}
        on:click={toggleEnabled}
      />
      <span
        class="inline-flex items-center size-5 mt-2 justify-center text-xs rounded-full"
        class:selected={position == i + 1}
        class:surrounding={isSurroundingPosition(i + 1, position)}
      >
        {i + 1}
      </span>
    </div>
  {/each}
</div>

<style type="postcss" global>
  @reference "tailwindcss";

  .selected {
    @apply bg-purple-900 text-white;
  }

  .surrounding {
    @apply bg-gray-200;
  }
</style>
