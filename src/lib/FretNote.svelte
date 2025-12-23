<script>
  let { note } = $props();

  $effect(() => {
    console.log("FretNote note:", note);
  });
</script>

<g
  data-interval={note.interval}
  data-in-scale={!!note.interval}
  data-fret={note.fret}
  class:in-scale={!!note.interval}
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
    @apply fill-white;
  }

  .fret-note-text {
    @apply text-xs fill-gray-500;
  }

  .in-scale .fret-note-background {
    @apply fill-sky-600 stroke-1 stroke-sky-800;
  }

  .in-scale .fret-note-text {
    @apply fill-white font-black;
  }

  .in-scale[data-interval="1P"] circle {
    @apply fill-gray-800 stroke-gray-900 stroke-2;
  }

  .in-scale:is([data-interval^="3"], [data-interval^="5"]) circle {
    @apply fill-sky-800;
  }
</style>
