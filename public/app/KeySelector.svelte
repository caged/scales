<script>
import {Range} from '@tonaljs/tonal'

let key = 'C'
let modifier
const notes = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
</script>

<div class="flex items-center space-x-5">
  <div>
    <select name="key" bind:value={key} class="rounded-lg  border-gray-300">
      {#each notes as note}
        <option value={note}>{note}</option>
      {/each }
    </select>
  </div>
  <div class="flex items-center">
    <input type=radio bind:group={modifier} value="b" class="mr-1">
    <span class="text-2xl">♭</span>
  </div>
  <div class="flex items-center">
    <input type=radio bind:group={modifier} value="#" class="mr-1">
    <span>#</span>
  </div>
</div>

