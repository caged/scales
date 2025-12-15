<script>
  import { Chord, Mode } from "tonal";
  import { getContext, onMount } from "svelte";
  import { SVGuitarChord } from "svguitar";
  import {
    getChordFingerings,
    getChordVariations,
  } from "$lib/../frets/chordFingerings.js";

  let { scale, onchordchange } = $props();

  const { player } = getContext("app");

  let chordElements = $state({});
  let chords = $state(() => Mode.triads(scale.type(), scale.tonic()));

  function handleMouseUp(event) {
    const chordName = event.currentTarget.dataset.chord;

    // Use the first position's MIDI notes from chord-db
    const fingerings = getChordFingerings(chordName);

    if (!fingerings || fingerings.length === 0) {
      console.warn(`No fingerings found for ${chordName}`);
      return;
    }

    const firstPosition = fingerings[0];
    const midi = firstPosition.midi;

    player.play(midi, 15);

    // Get chord info for callback
    const chord = Chord.get(chordName);
    onchordchange?.(chord);
  }

  function renderChord(element, chord) {
    if (!element) return;

    // Standard chord rendering
    const variations = getChordVariations(chord);

    if (!variations || variations.length === 0) {
      console.warn(`No fingerings found for ${chord}`);
      return;
    }

    // Use the first variation
    const chordData = variations[0];
    // Create the SVGuitar instance
    const chart = new SVGuitarChord(element);
    chart
      .configure({
        strings: 6,
        frets: 4,
        position: chordData.position || 1,
        strokeWidth: 1,
        fingerSize: 0.5,
        fingerColor: "#222",
        fingerTextSize: 16,
        fretSize: 1.2,
        fretColor: "#444",
        color: "#333",
        tuning: [],
        nutWidth: 6,
        sidePadding: 0.2,
        barreChordRadius: 0.5,
      })
      .chord({
        fingers: chordData.fingers,
        barres: chordData.barres,
      })
      .draw();
  }

  onMount(() => {
    // Render all chord diagrams after mount
    Object.entries(chordElements).forEach(([chordLabel, element]) => {
      renderChord(element, chordLabel);
    });
  });

  $effect(() => {
    const triads = Mode.triads(scale.type(), scale.tonic());

    // Sort chords so diminished chords appear last
    chords = triads.sort((a, b) => {
      const aIsDim = a.includes("dim") || a.includes("°") || a.includes("o");
      const bIsDim = b.includes("dim") || b.includes("°") || b.includes("o");

      if (aIsDim && !bIsDim) return 1; // a is dim, move to end
      if (!aIsDim && bIsDim) return -1; // b is dim, move to end
      return 0; // maintain original order
    });

    // Re-render when tonic changes
    Object.entries(chordElements).forEach(([chordLabel, element]) => {
      if (element) {
        element.innerHTML = "";
        renderChord(element, chordLabel);
      }
    });
  });
</script>

<div
  class="text-xs text-gray-500 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4"
>
  {#each chords as chord}
    <button
      type="button"
      onmouseup={handleMouseUp}
      class="flex flex-col justify-between items-center p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded transition-colors"
      data-chord={chord}
    >
      <div class="font-semibold mb-2">{chord}</div>
      <div bind:this={chordElements[chord]} class="chord-diagram w-full"></div>
    </button>
  {/each}
</div>

<style>
  .chord-diagram :global(svg) {
    width: 100%;
    height: auto;
  }

  .chord-diagram :global(.barre-rectangle) {
    fill: !important;
  }
</style>
