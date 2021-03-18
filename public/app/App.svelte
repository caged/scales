<script>
import KeySelector from './KeySelector.svelte'
import CustomScaleSelector from  './CustomScaleSelector.svelte'

let key = 'C'
let scale = ''
</script>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="flex border-b border-gray-200">
  <div class="p-5 border-r border-gray-200"><KeySelector bind:key /></div>
  <div class="flex items-center w-1/3 p-5">
    <CustomScaleSelector bind:value={scale} />
  </div>
  <div class="flex items-center">
    {key} {scale}
  </div>
</div>