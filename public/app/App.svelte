<script>
  import { scale as getScale } from "../dist/index";
  import Tailwind from "./Tailwind.svelte";
  import KeySelector from "./KeySelector.svelte";
  import ScaleSelector from "./ScaleSelector.svelte";
  import FretBoard from "./FretBoard.svelte";
  import ScaleInfo from "./ScaleInfo.svelte";

  let key = "D";
  let scaleLabel = "minor";
  let system;
  let position;

  $: scaleName = `${key} ${scaleLabel}`;
  $: scale = getScale(scaleName);
</script>

<div class="flex items-center border-b border-gray-200">
  <svg
    class="w-5 h-5 ml-5 text-green-500"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    />
  </svg>
  <div class="flex flex-none flex-col p-5 border-r border-gray-200">
    <div><KeySelector bind:key /></div>
  </div>
  <div class="flex flex-col w-1/3 p-5">
    <div><ScaleSelector bind:value={scaleLabel} /></div>
  </div>
</div>
<div>
  <div class="flex items-center mb-5 border-b border-gray-200">
    <div class="p-5">
      <h1 class="font-bold text-2xl">{key} {scaleLabel} scale</h1>
    </div>
    <div class="flex-initial w-1/3 p-5">
      <ScaleInfo bind:scale />
    </div>
    <div>
      <span class="font-bold">Three note per string position: </span>
      <select bind:value={position} class="rounded-lg border-gray-300 border">
        <option value="">none</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
      </select>
    </div>
  </div>
  <div>
    <FretBoard bind:scale bind:system bind:position />
  </div>
</div>
