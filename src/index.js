import { Note, Scale, Range } from '@tonaljs/tonal'
import { select, range, scaleBand, scalePoint } from 'd3'

document.addEventListener('DOMContentLoaded', () => {
  const margin = { t: 0, r: 0, b: 0, l: 0 }
  const width = window.innerWidth
  const height = Math.round(width / 6)
  const fretHeight = Math.round(height * 0.9)
  const tuning = ['E', 'A', 'D', 'G', 'B', 'E']
  const frets = range(1, 25)
  const notes = tuning.map((t) =>
    Range.chromatic([`${t}0`, `${t}2`], { flats: true })
  )

  const fretData = frets.map((d) => {
    return tuning.map((_, i) => notes[i][d])
  })

  const fretX = scaleBand().domain(frets).rangeRound([0, width]).padding(0.05)
  const noteY = scalePoint()
    .padding(1)
    .domain(range(tuning.length))
    .rangeRound([fretHeight, 0])

  const svg = select('#neck')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])

  const fret = svg
    .selectAll('.fret')
    .data(frets)
    .join('g')
    .attr('transform', (d) => `translate(${fretX(d)}, 0)`)
    .attr('fill', '#eee')
    .attr('class', 'fret')

  const opens = svg
    .selectAll('.open')
    .data(tuning)
    .join('g')
    .attr('transform', (d, i) => `translate(0, ${noteY(i) + 4})`)
    .attr('class', 'open')

  opens.append('text').text(String).attr('font-size', 12)

  fret
    .append('rect')
    .attr('width', fretX.bandwidth())
    .attr('height', fretHeight)

  const labels = fret
    .append('g')
    .attr('transform', `translate(${fretX.bandwidth() / 2}, ${height})`)
    .attr('fill', '#333')
    .attr('text-anchor', 'middle')
    .attr('font-size', 12)

  labels.append('text').text(String)
  labels
    .filter((d) => (d % 2 != 0 && d != 1 && d != 11 && d != 13) || d == 12)
    .append('text')
    .text((d) => (d == 12 ? '··' : '·'))
    .attr('font-size', 50)
    .attr('fill', 'gold')

  const note = fret
    .selectAll('.string')
    .data(tuning)
    .join('g')
    .attr('transform', (d, i) => `translate(0, ${noteY(i)})`)
    .attr('class', 'string')

  note
    .append('rect')
    .attr('width', fretX.bandwidth())
    .attr('height', 2)
    .attr('fill', '#ddd')

  note.append('text')
})
