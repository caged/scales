<script>
  import { getChordVariations } from "../frets/chordFingerings.js";
  import { tunings } from "$lib";
  import { getContext } from "svelte";
  import { SVGuitarChord } from "svguitar";

  let {
    chordName,
    position = 0,
    tuning = tunings.get("Standard"),
    frets = 4,
  } = $props();

  const { player } = getContext("app");

  let el = $state(null);
  let width = $state(0);
  let height = $state(0);

  const variations = $derived(getChordVariations(chordName, tuning));
  // Use the first variation
  const chordData = $derived(variations.positions[position]);

  function playChord() {
    if (chordData?.midi) {
      console.log("Playing chord:", chordName, "MIDI:", chordData.midi);
      player.play(chordData.midi, 15);
    } else {
      console.warn(
        `No MIDI data available for ${chordName} at position ${position}`,
      );
    }
  }

  $effect(() => {
    // Redraw the chord whenever props or chordData changes
    if (!el || !chordData) return;

    // Clear the existing SVG content
    el.innerHTML = "";

    // Create a new SVGuitar instance and draw
    const chart = new SVGuitarChord(el);
    chart
      .configure({
        title: chordName,
        strings: tuning.length,
        frets: frets,
        position: chordData.position,
        strokeWidth: 1,
        fingerSize: 0.5,
        fingerColor: "#333",
        fingerTextSize: 20,
        fretSize: 1.1,
        fretColor: "#333",
        color: "#333",
        titleFontSize: 28,
        titleBottomMargin: 10,
        fretLabelFontSize: 20,
        tuning,
        nutWidth: 12,
        sidePadding: 0.2,
        barreChordRadius: 0.5,
        fontFamily:
          'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      })
      .chord({
        fingers: chordData.fingers,
        barres: chordData.barres,
      })
      .draw();
  });
</script>

<button
  class="flex cursor-pointer w-full h-full"
  aria-label="Play {chordName} chord at position {position}"
  onclick={playChord}>
  <div
    bind:clientWidth={width}
    bind:clientHeight={height}
    bind:this={el}
    data-chord={chordName}
    class="w-full h-full flex">
  </div>
</button>

<style>
  :global(.barre-rectangle) {
    fill: #333 !important;
  }

  :global(.tuning) {
    display: none;
  }
</style>
