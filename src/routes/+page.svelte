<script>
  import { tunings } from "../lib";
  import frets from "../lib/frets";
  import TuningSelector from "../lib/TuningSelector.svelte";
  import FretBoard from "../lib/FretBoard.svelte";
  import KeySelector from "../lib/KeySelector.svelte";
  import ScaleSelector from "../lib/ScaleSelector.svelte";
  import { Scale } from "tonal";

  let tuning = $state("Standard");
  let key = $state("F");
  let scale = $state("minor pentatonic");
  let fretData = $derived(frets(tunings.get(tuning), 16, `${key} ${scale}`));
  let scaleObj = $derived(Scale.get(`${key} ${scale}`));
</script>

<svelte:head>
  <title>Hey there</title>
  <meta name="Description" content="Hey there guitar scale" />
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
    {scaleObj.notes}
  </div>
</div>

<div class=" m-10 h-60">
  <FretBoard {fretData} />
</div>
