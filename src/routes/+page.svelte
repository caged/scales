<script>
  import { tunings } from "../lib";
  import frets from "../frets";
  import { Scale, Mode } from "tonal";
  import TuningSelector from "../lib/TuningSelector.svelte";
  import FretBoard from "../lib/FretBoard.svelte";
  import KeySelector from "../lib/KeySelector.svelte";
  import ScaleSelector from "../lib/ScaleSelector.svelte";
  import ScaleChords from "../lib/ScaleChords.svelte";
  import ScaleInfo from "../lib/ScaleInfo.svelte";
  import SystemSelector from "../lib/SystemSelector.svelte";

  let tuning = $state("Standard");
  let key = $state("C");
  let scale = $state("minor pentatonic");
  let scaleObj = $derived(Scale.get(`${key} ${scale}`));
  let system = $state("CAGED");
  let position = $state(null);
  let fretData = $derived(frets(tunings.get(tuning), 16, scaleObj));
  let triads = $derived(Mode.triads(scaleObj.type, scaleObj.tonic));

  // Filter fretData based on selected system and position
  let filteredFretData = $derived.by(() => {
    if (!position || !system) return fretData;

    // Check if the current scale has positions for this system
    const hasSystemPositions = fretData.strings.some((string) =>
      string.some(
        (note) => note.positions[system] && note.positions[system].length > 0,
      ),
    );

    if (!hasSystemPositions) return fretData;

    // Create filtered strings with only notes in the selected position
    const filteredStrings = fretData.strings.map((notes) =>
      notes.map((note) => {
        // Keep the note but mark if it should be in the selected position
        // Only show notes that are in the scale AND in the selected position
        const isInPosition = note.positions[system]?.includes(position);
        return {
          ...note,
          inPosition: isInPosition && !!note.interval, // Only scale notes in this position
        };
      }),
    );

    return {
      ...fretData,
      strings: filteredStrings,
    };
  });

  $effect(() => {
    console.log("Page state:", {
      fretData,
      filteredFretData,
      tuning,
      key,
      scale,
      system,
      position,
      scaleIntervals: scaleObj.intervals?.length,
    });
  });
</script>

<svelte:head>
  <title>{key} {scale} Scale</title>
  <meta name="Description" content="{key} {scale} scale for guitar" />
</svelte:head>

<div
  class="flex bg-gray-50 *:p-5 *:border-r *:border-gray-200 border-b border-gray-300">
  <div>
    <TuningSelector bind:value={tuning} />
  </div>
  <div>
    <KeySelector bind:value={key} />
  </div>
  <div>
    <ScaleSelector bind:value={scale} />
  </div>
  <div class="">
    <SystemSelector bind:system bind:position />
  </div>
  <div class="border-r-0">
    <ScaleInfo scale={scaleObj} />
  </div>
</div>

<div class="p-5 h-72">
  <FretBoard fretData={filteredFretData} />
</div>

{#if triads.length > 0}
  <div class="relative bg-gray-50 border-t border-gray-200 p-5">
    <ScaleChords scale={scaleObj} />
  </div>
{/if}
