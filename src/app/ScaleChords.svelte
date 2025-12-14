<script>
  import { Chord, Mode } from "tonal";
  import { getContext, onMount } from "svelte";
  import { SVGuitarChord } from "svguitar";
  import {
    getChordFingerings,
    getChordVariations,
  } from "../frets/chordFingerings.js";

  let { scale, onchordchange } = $props();

  const { player } = getContext("app");

  let chordElements = $state({});
  let chords = $state(() => Mode.triads(scale.type(), scale.tonic()));

  function handleMouseUp(event) {
    const chordName = event.currentTarget.dataset.chord;

    // Get the fingering positions from chord-db
    const fingerings = getChordFingerings(chordName);

    if (!fingerings || fingerings.length === 0) {
      console.warn(`No fingerings found for ${chordName}`);
      return;
    }

    // Use the first position's MIDI notes
    const firstPosition = fingerings[0];
    const midi = firstPosition.midi;

    console.log("Playing chord:", chordName, midi);
    player.play(midi, 15);

    // Get chord info for callback
    const chord = Chord.get(chordName);
    onchordchange?.(chord);
  }

  function renderChord(element, chord) {
    if (!element) return;

    // Get the full chord name with tonic

    const variations = getChordVariations(chord);

    if (!variations || variations.length === 0) {
      console.warn(`No fingerings found for ${chord}`);
      return;
    }

    // Use the first variation
    const chordData = variations[0];

    // Create the SVGuitar instance
    const chart = new SVGuitarChord(element);
    console.log("Rendering chord:", chord, chordData);
    chart
      .configure({
        strings: 6,
        frets: 4,
        position: chordData.position || 1,
        style: "normal",
        strokeWidth: 1,
        fingerSize: 0.5,
        fingerTextSize: 16,
        fretSize: 1.2,
        color: "#333",
        backgroundColor: "transparent",
        tuning: [],
        nutWidth: 6,
        sidePadding: 0.1,
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
    console.log(scale.type(), scale.tonic());

    chords = Mode.triads(scale.type(), scale.tonic());

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
      class="flex flex-col items-center p-2 bg-gray-100 hover:bg-gray-200 cursor-pointer rounded transition-colors"
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
</style>
