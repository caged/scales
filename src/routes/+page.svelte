<script>
  import { tunings } from "../lib";
  import frets from "../lib/frets";
  import TuningSelector from "../lib/TuningSelector.svelte";
  import FretBoard from "../lib/FretBoard.svelte";
  import KeySelector from "../lib/KeySelector.svelte";

  let tuning = $state("Standard");
  let fretData = $derived(frets(tunings.get(tuning), 16));
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
    <KeySelector key="C" />
  </div>
</div>

<div class=" m-10 h-60">
  <FretBoard {fretData} />
</div>
