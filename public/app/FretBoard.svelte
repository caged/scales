<script>
import { note } from '@tonaljs/core'
import {scaleBand, scalePoint, range} from 'd3'
import {frets, scale, tnps} from '../dist/index'
export let scaleName = 'A minor'
const fb = frets()
const fbnotes = fb.notes()

const margin = { top: 10, right: 10, bottom: 10, left: 10 }
const width = 1200
const height = 200

const fretX = scaleBand()
  .domain(range(fb.count() + 1))
  .range([margin.left, width - margin.right])

const strY = scalePoint()
  .domain(range(fbnotes.length))
  .range([margin.top, height - margin.bottom])

$: strings = tnps(fb.notes(), scale(scaleName))
</script>

<div>
  <svg viewBox="0 0 {width} {height}" width={width} height={height}>
    {#each strings as str, i}
      <g transform="translate({margin.left}, {strY(i)})">
        {#each str as note, j}
          <g transform="translate({fretX(j)}, 0)">
            <text class="{note.interval ? 'text-green-500' : 'text-gray-500'} text-xs" fill="currentColor">{note.pc.replace('b', '♭')}</text>
          </g>
        {/each}
      </g>
    {/each}
  </svg>
</div>