<script>
import {ScaleType} from '@tonaljs/tonal'

const scales = ScaleType.all().sort((a, b) => {
  return b.intervals.length - a.intervals.length
})
</script>

<select name="scale" class="rounded-lg border-gray-300">
  {#each scales as s}
    <option value="{s.name}">{s.name}</option>
  {/each}
</select>