<script>
  let { note } = $props();

  // Check if note is in the selected position (for position filtering)
  let inPosition = $derived(note.inPosition !== false);
</script>

<g
  data-interval={note.interval}
  data-in-scale={!!note.interval}
  data-in-position={inPosition}
  data-fret={note.fret}
  class:in-scale={!!note.interval}
  class:in-position={inPosition}
  class="fret-note">
  <circle class="fret-note-background" r="12"></circle>
  <text
    dy="1"
    font-size="12"
    text-anchor="middle"
    class="fret-note-text"
    dominant-baseline="middle">{note.label}</text>
</g>

<style>
  @reference "tailwindcss";

  .fret-note-background {
    @apply fill-white dark:fill-gray-800;
  }

  .fret-note-text {
    @apply text-xs fill-gray-500 dark:fill-gray-400;
  }

  .fret-note:not(.in-position):is(.in-scale) .fret-note-background {
    @apply hidden;
  }

  .fret-note:not(.in-position):is(.in-scale) .fret-note-text {
    @apply font-normal fill-gray-500 dark:fill-gray-400;
  }

  .in-scale .fret-note-background {
    @apply fill-sky-600 stroke-1 stroke-sky-800;
  }

  .in-scale .fret-note-text {
    @apply fill-white font-black;
  }

  .in-scale[data-interval="1P"] circle {
    @apply fill-gray-800 dark:fill-gray-200 stroke-gray-900 dark:stroke-gray-100 stroke-2;
  }

  .in-scale[data-interval="1P"] .fret-note-text {
    @apply dark:fill-gray-900;
  }

  .in-scale:is([data-interval^="3"], [data-interval^="5"]) circle {
    @apply fill-sky-800;
  }
</style>
