<script>
  import { tuning } from "./store";

  export let defaultTuning;

  const tunings = [
    ["E Standard", "E2 A2 D3 G3 B3 E4"],
    ["Drop D", "D2 A2 D3 G3 B3 E4"],
    ["Drop C", "C2 G2 C3 F3 A3 D4"],
    ["B Standard - Seven string", "B2 E2 A2 D3 G3 B3 E4"],
    ["Drop A - Seven string", "A1 E2 A2 D3 G3 B3 E4"],
  ];

  let theTuning = defaultTuning.join(" ");

  $: {
    tuning.set(Array.isArray(theTuning) ? theTuning : theTuning.split(" "));
  }
</script>

<select
  name="tuning"
  bind:value={theTuning}
  class="w-full rounded-lg border-gray-200"
>
  {#each tunings as [name, notes]}
    <option value={notes}>{name}</option>
  {/each}
</select>
