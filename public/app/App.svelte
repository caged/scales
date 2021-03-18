<script>
import KeySelector from './KeySelector.svelte'
</script>

<style global>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<div class="flex border-b border-gray-200">
  <div class="p-5 border-r border-gray-200"><KeySelector /></div>
  <div class="flex-1 p-5">Other</div>
</div>