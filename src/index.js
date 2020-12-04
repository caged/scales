import { Note, Scale, Range } from '@tonaljs/tonal'
import { select, range, scaleBand, scalePoint, scaleLinear } from 'd3'

document.addEventListener('DOMContentLoaded', () => {
  const margin = { t: 10, r: 10, b: 10, l: 10 }
  const width = window.innerWidth
  const height = Math.round(width / 6)
  const fheight = height - margin.t - margin.b
  const tuning = ['E', 'A', 'D', 'G', 'B', 'E']
  const notes = tuning.map((t) =>
    Range.chromatic([`${t}0`, `${t}2`], { sharps: true })
  )
  const fretData = range(25).map((d) => tuning.map((_, i) => notes[i][d]))
  const openNotes = fretData.splice(0, 1)

  const fx = scaleBand()
    .domain(fretData)
    .range([margin.l, width - margin.r])
    .paddingInner(0.05)

  const fy = scaleLinear().range([height - margin.b, margin.t])
  const sy = scalePoint().domain(tuning).range([fheight, 0])

  const svg = select('#neck')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('border', '1px dotted #333')

  const frets = svg
    .selectAll('.fret')
    .data(fretData)
    .join('g')
    .attr('transform', (d) => `translate(${fx(d)}, ${margin.t})`)
    .attr('class', 'fret')

  frets
    .append('rect')
    .attr('width', fx.bandwidth())
    .attr('height', height - margin.t - margin.b)
    .attr('fill', '#eee')

  // const opens = svg
  //   .selectAll('.open')
  //   .data(tuning)
  //   .join('g')
  //   .attr('transform', (d, i) => `translate(0, ${noteY(i) + 4})`)
  //   .attr('class', 'open')

  // opens.append('text').text(String).attr('font-size', 12)

  // fret
  //   .append('rect')
  //   .attr('width', fretX.bandwidth())
  //   .attr('height', fretHeight)

  // const labels = fret
  //   .append('g')
  //   .attr('transform', `translate(${fretX.bandwidth() / 2}, ${height})`)
  //   .attr('fill', '#333')
  //   .attr('text-anchor', 'middle')
  //   .attr('font-size', 12)

  // labels.append('text').text(String)
  // labels
  //   .filter((d) => (d % 2 != 0 && d != 1 && d != 11 && d != 13) || d == 12)
  //   .append('text')
  //   .text((d) => (d == 12 ? '··' : '·'))
  //   .attr('font-size', 50)
  //   .attr('fill', 'gold')

  // const note = fret
  //   .selectAll('.string')
  //   .data(tuning)
  //   .join('g')
  //   .attr('transform', (d, i) => `translate(0, ${noteY(i)})`)
  //   .attr('class', 'string')

  // note
  //   .append('rect')
  //   .attr('width', fretX.bandwidth())
  //   .attr('height', 2)
  //   .attr('fill', '#ddd')

  // note.append('text')
})
