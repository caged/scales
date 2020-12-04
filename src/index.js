import { Note, Scale, Range } from '@tonaljs/tonal'
import { select, range, scaleBand, scalePoint } from 'd3'

document.addEventListener('DOMContentLoaded', () => {
  const width = window.innerWidth
  const height = Math.round(width / 6)
  const tuning = ['E', 'A', 'D', 'G', 'B', 'E']
  const frets = range(1, 25)
  const notes = tuning.map((t) =>
    Range.chromatic([`${t}0`, `${t}2`], { flats: true })
  )

  const fretX = scaleBand().domain(frets).rangeRound([0, width]).padding(0.05)

  const svg = select('#neck')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])

  const fret = svg
    .selectAll('.fret')
    .data(frets)
    .join('g')
    .attr('transform', (d) => `translate(${fretX(d)}, 0)`)
    .attr('fill', '#eee')

  fret.append('rect').attr('width', fretX.bandwidth).attr('height', height)

  fret.append('text').style('fill', 'black').attr('y', 20).text(String)
})
