<script>
  import { tunings } from "../lib";
  import frets from "../lib/frets";
  import TuningSelector from "../lib/TuningSelector.svelte";
  import FretBoard from "../lib/FretBoard.svelte";
  import KeySelector from "../lib/KeySelector.svelte";
  import ScaleSelector from "../lib/ScaleSelector.svelte";
  import ScaleChords from "../lib/ScaleChords.svelte";
  import ScaleInfo from "../lib/ScaleInfo.svelte";
  import { Scale } from "tonal";

  let tuning = $state("Standard");
  let key = $state("C");
  let scale = $state("major");
  let fretData = $derived(frets(tunings.get(tuning), 16, `${key} ${scale}`));
  let scaleObj = $derived(Scale.get(`${key} ${scale}`));
</script>

<svelte:head>
  <title>{key} {scale} Scale</title>
  <meta name="Description" content="{key} {scale} scale for guitar" />
</svelte:head>

<div class="flex *:p-5 *:border-r *:border-gray-200 border-b border-gray-200">
  <div>
    <TuningSelector bind:value={tuning} />
  </div>
  <div>
    <KeySelector bind:value={key} />
  </div>
  <div>
    <ScaleSelector bind:value={scale} />
  </div>
  <div class="flex-1">
    <ScaleInfo scale={scaleObj} />
  </div>
</div>

{#if scaleObj.notes.length === 7}
  <div class="relative bg-gray-50 p-5">
    <ScaleChords scale={scaleObj} />
  </div>
{/if}

<div class="p-5 h-72">
  <FretBoard {fretData} />
</div>
