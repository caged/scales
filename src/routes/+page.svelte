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
  let scale = $state("major");
  let scaleObj = $derived(Scale.get(`${key} ${scale}`));
  let position = $state(null);
  let system = $state("CAGED");
  let fretData = $derived(frets(tunings.get(tuning), 16, scaleObj));
  let triads = $derived(Mode.triads(scaleObj.type, scaleObj.tonic));
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
    <ScaleInfo scale={scaleObj} />
  </div>
  <div>
    <SystemSelector bind:system bind:position />
  </div>
</div>

<div class="p-5 h-72">
  <FretBoard {fretData} />
</div>

{#if triads.length > 0}
  <div class="relative bg-gray-50 border-t border-gray-200 p-5">
    <ScaleChords scale={scaleObj} />
  </div>
{/if}
