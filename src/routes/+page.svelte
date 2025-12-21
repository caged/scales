<script>
  import { tunings } from "../lib";
  import frets from "../lib/frets";
  import TuningSelector from "../lib/TuningSelector.svelte";
  import FretBoard from "../lib/FretBoard.svelte";

  let tuning = $state("Standard");
  let fretData = $derived(frets(tunings.get(tuning), 13));
</script>

<svelte:head>
  <title>Hey there</title>
  <meta name="Description" content="Hey there guitar scale" />
</svelte:head>

<div class="flex gap-5 *:p-5 border-b border-gray-200">
  <div>
    <TuningSelector bind:value={tuning} />
  </div>
</div>

<div class=" m-10 h-60 overflow-clip">
  <FretBoard {fretData} />
</div>
