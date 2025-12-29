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
    @apply fill-transparent;
  }

  .fret-note-text {
    @apply text-xs fill-gray-500 dark:fill-blue-500;
  }

  .fret-note:not(.in-position):is(.in-scale) .fret-note-background {
    @apply hidden;
  }

  .fret-note:not(.in-position):is(.in-scale) .fret-note-text {
    @apply font-normal fill-gray-500 dark:fill-blue-500;
  }

  .in-scale .fret-note-background {
    @apply fill-sky-600 stroke-0 stroke-sky-800 dark:fill-blue-900 dark:stroke-sky-800;
  }

  .in-scale .fret-note-text {
    @apply fill-white font-black;
  }

  .in-scale[data-interval="1P"] circle {
    @apply fill-gray-800 stroke-1 stroke-gray-900 dark:fill-blue-600 dark:stroke-blue-300;
  }

  .in-scale[data-interval="1P"] .fret-note-text {
    @apply dark:fill-blue-100;
  }

  .in-scale:is([data-interval^="3"], [data-interval^="5"]) circle {
    @apply fill-blue-700 stroke-1 stroke-blue-600;
  }
</style>
