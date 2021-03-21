<script>
  import { scale as getScale, tnps } from "../dist/index";
  import Tailwind from "./Tailwind.svelte";
  import KeySelector from "./KeySelector.svelte";
  import ScaleSelector from "./ScaleSelector.svelte";
  import FretBoard from "./FretBoard.svelte";
  import ScaleInfo from "./ScaleInfo.svelte";
  import PositionSelector from "./PositionSelector.svelte";
  import TuningSelector from "./TuningSelector.svelte";
  import { Chord, Scale } from "@tonaljs/tonal";

  let key = "A";
  let scaleLabel = "minor";
  let system = tnps;
  let position;
  let selectedTuning = "E2 A2 D3 G3 B3 E4";

  $: scaleName = `${key} ${scaleLabel}`;
  $: scale = getScale(scaleName);
  $: tuning = selectedTuning.split(" ");
</script>

<svelte:head>
  <title>{scaleName}</title>
  <meta name="Description" content="{scaleName} guitar scale" />
  <html lang="en" />
</svelte:head>

<div class="flex border-b border-gray-300">
  <div class="p-5 border-r border-gray-200">
    <h3 class="mb-2 font-bold">Tuning</h3>
    <div><TuningSelector bind:value={selectedTuning} /></div>
  </div>
  <div class="p-5 border-r border-gray-200">
    <h3 class="mb-2 font-bold">Key</h3>
    <div><KeySelector bind:key /></div>
  </div>
  <div class="w-1/4 p-5 pb-6 border-r border-gray-200">
    <h3 class="font-bold mb-2">Scale</h3>
    <div><ScaleSelector bind:value={scaleLabel} /></div>
  </div>
  <div class="p-5">
    <h3 class="mb-2 font-bold">Position</h3>
    <PositionSelector {system} bind:position />
  </div>
</div>
<div>
  {#if scaleLabel != ""}
    <div class="flex border-b border-gray-100 bg-gray-50 space-x-10">
      <div class="p-5  flex-initial">
        <h1 class="font-bold text-2xl">{key} {scaleLabel} scale</h1>
        <span class="text-sm text-gray-500 capitalize">{scale.aliases()}</span>
      </div>
      <div class="w-1/3  p-5">
        <h3 class="font-bold">Notes and intervals</h3>
        <ScaleInfo bind:scale />
      </div>
      <div class="p-5">
        <h3 class="font-bold">Chords</h3>
        <ul class="text-xs text-gray-500 grid grid-cols-6 lg:grid-cols-8 gap-1">
          {#each Scale.scaleChords(scaleLabel) as chord}
            <li class="px-1 py-1 rounded text-center bg-gray-200">{chord}</li>
          {/each}
        </ul>
      </div>
    </div>
  {/if}
  <div class="py-10">
    <FretBoard bind:scale bind:system bind:position bind:tuning />
  </div>
</div>
