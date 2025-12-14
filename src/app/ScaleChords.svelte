<script>
  import { Scale, Chord, Note, Midi } from "tonal";
  import { getContext, onMount } from "svelte";
  import { tonic, tuning } from "./store";
  import { SVGuitarChord } from "svguitar";
  import { getChordVariations } from "../frets/chordFingerings.js";

  let { scale, onchordchange } = $props();

  const lowestNote = Note.get($tuning[0]);
  const { player } = getContext("app");

  let chordElements = {};

  function handleMouseUp(event) {
    const chordName = event.currentTarget.dataset.chord;
    const rootNote = Note.get(
      `${$tonic}${$tonic === "C" ? lowestNote.oct + 1 : lowestNote.oct}`,
    );
    const startNote =
      rootNote.height < lowestNote.height
        ? Note.get(`${rootNote.name}${rootNote.oct + 1}`)
        : rootNote;

    const chord = Chord.getChord(chordName, startNote);
    const notesWithOctaves = Chord.notes(chordName, startNote);
    const midi = notesWithOctaves.map(Midi.toMidi);
    player.play(midi, 15);

    onchordchange?.(chord);
  }

  function renderChord(element, chordLabel) {
    if (!element) return;

    // Get the full chord name with tonic
    const fullChordName = `${$tonic}${chordLabel}`;
    const variations = getChordVariations(fullChordName);

    if (!variations || variations.length === 0) {
      console.warn(`No fingerings found for ${fullChordName}`);
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
  class="text-xs text-gray-500 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-10 gap-4"
>
  {#each Scale.scaleChords(scale.name()) as chordLabel}
    <button
      type="button"
      onmouseup={handleMouseUp}
      class="flex flex-col items-center p-2 bg-gray-100 hover:bg-purple-600 hover:text-white cursor-pointer rounded transition-colors"
      data-chord={chordLabel}
    >
      <div class="font-semibold mb-2">{chordLabel}</div>
      <div
        bind:this={chordElements[chordLabel]}
        class="chord-diagram w-full"
      ></div>
    </button>
  {/each}
</div>

<style>
  .chord-diagram :global(svg) {
    width: 100%;
    height: auto;
  }
</style>
