<script>
  import { tuning } from "./store";

  let value;
  const tunings = [
    ["Standard", "E2 A2 D3 G3 B3 E4"],
    ["Drop D", "D2 A2 D3 G3 B3 E4"],
    ["Standard - Seven string", "B2 E2 A2 D3 G3 B3 E4"],
    ["Drop A - Seven string", "A1 E2 A2 D3 G3 B3 E4"],
  ];

  tuning.subscribe((v) => {
    value = v.join(" ");
  });

  $: tuning.set(value.split(" "));
</script>

<select name="tuning" bind:value class="rounded-lg border-gray-200">
  {#each tunings as [name, notes]}
    <option value={notes}>{name}</option>
  {/each}
</select>
