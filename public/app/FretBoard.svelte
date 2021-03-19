<script>
import { note } from '@tonaljs/core'
import {scaleBand, scalePoint, scaleSequential, range} from 'd3'
import {interpolateRainbow} from 'd3-scale-chromatic'
import {frets, scale as createScale, tnps} from '../dist/index'

export let scaleName = 'A minor'

const margin = { top: 10, right: 10, bottom: 10, left: 10 }
const width = 1200
const height = 200
const dotR = 24

let fb, fbnotes, scale, scaleLen, strings, fretX, strY, dotX, color;

$: if(scaleName) {
   fb = frets()
   scale = createScale(scaleName)
   fbnotes = fb.notes()
   strings = tnps(fbnotes, scale)
   scaleLen = scale.notes().length;

  fretX = scaleBand()
    .domain(range(fb.count() + 1))
    .range([margin.left, width - margin.right])

  strY = scalePoint()
    .domain(range(fbnotes.length))
    .range([margin.top, height - margin.bottom])
  
  dotX = scalePoint()
    .domain(range(scale.notes().length))
    .range([margin.left, width / 3 - margin.right])
  
  color = scaleSequential(interpolateRainbow)
    .domain([0, scaleLen])
}

</script>

<div>
  <div class="flex mb-10 border-b border-gray-300">
    <div class="p-5">
      <svg viewBox="0 0 {width  / 3} {dotR * 2}">
        {#each scale.notes() as note, i}
        <g transform="translate({dotX(i)}, {20})">
          <circle r="{dotR/2.5}" fill={color(i)} />
          <text text-anchor="middle" dy="4" class="text-white text-xs" fill="currentColor">{note.name}</text>
        </g>
        {/each}
      </svg>
    </div>
    <div class="p-5">
      <svg viewBox="0 0 {width  / 3} {dotR * 2}">
        {#each scale.intervals() as interval, i}
        <g transform="translate({dotX(i)}, {20})">
          <circle r="{dotR/2.5}" fill={color(i)} />
          <text text-anchor="middle" dy="4" class="text-white text-xs" fill="currentColor">{interval}</text>
        </g>
        {/each}
      </svg>
    </div>
  </div>
  
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