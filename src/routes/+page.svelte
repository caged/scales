<script>
  import { tunings } from "../lib";
  import frets from "../frets";
  import TuningSelector from "../lib/TuningSelector.svelte";
  import FretBoard from "../lib/FretBoard.svelte";
  import KeySelector from "../lib/KeySelector.svelte";
  import ScaleSelector from "../lib/ScaleSelector.svelte";
  import ScaleChords from "../lib/ScaleChords.svelte";
  import ScaleInfo from "../lib/ScaleInfo.svelte";
  import { Scale, Mode } from "tonal";
  import Chord from "../frets/Chord.svelte";

  let tuning = $state("Standard");
  let key = $state("C");
  let scale = $state("major");
  let fretData = $derived(frets(tunings.get(tuning), 16, `${key} ${scale}`));
  let scaleObj = $derived(Scale.get(`${key} ${scale}`));
  let triads = $derived(Mode.triads(scaleObj.type, scaleObj.tonic));
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

<div class="p-5 h-72">
  <FretBoard {fretData} />
</div>

{#if triads.length > 0}
  <div class="relative bg-gray-50 border-t border-gray-200 p-5">
    <ScaleChords scale={scaleObj} />
  </div>
{/if}
