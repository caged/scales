<script>
import Tailwind from './Tailwind.svelte'
import KeySelector from './KeySelector.svelte'
import ScaleSelector from  './ScaleSelector.svelte'
import FretBoard from './FretBoard.svelte'

let key = 'A'
let scale = 'minor'
$: scaleName = `${key} ${scale}`
</script>


<div class="flex items-center border-b border-gray-200">
  <svg class="w-5 h-5 ml-5 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
  </svg>
  <div class="flex flex-none flex-col p-5 border-r border-gray-200">
    <div><KeySelector bind:key={key} /></div>
  </div>
  <div class="flex flex-col w-1/3 p-5">
    <div><ScaleSelector bind:value={scale} /></div>
  </div>
  <div class="flex items-center">
    {key} {scale}
  </div>
</div>
<div>
  <FretBoard bind:scaleName />
</div>