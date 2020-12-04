import { Note, Scale, Range } from '@tonaljs/tonal'
import { select, range, scaleBand, scalePoint, scaleLinear } from 'd3'

document.addEventListener('DOMContentLoaded', () => {
  const margin = { t: 20, r: 10, b: 30, l: 40 }
  const width = window.innerWidth
  const height = Math.round(width / 5)
  const fheight = height - margin.t - margin.b
  const tuning = ['E', 'A', 'D', 'G', 'B', 'E']
  const notes = tuning.map((t) =>
    Range.chromatic([`${t}0`, `${t}2`], { sharps: true })
  )
  const fretData = range(25).map((d) => tuning.map((_, i) => notes[i][d]))
  const openNotes = fretData.splice(0, 1)[0]

  const fx = scaleBand()
    .domain(fretData)
    .rangeRound([margin.l, width - margin.r])
    .paddingInner(0.05)

  const fy = scaleLinear().range([height - margin.b, margin.t])

  const sy = scalePoint()
    .domain(range(tuning.length))
    .rangeRound([fheight, 0])
    .padding(0.5)

  const sw = scaleLinear().domain([0, tuning.length]).range([3, 1])
  const noteRad = fx.bandwidth() / 4
  const getsMark = (fnum) =>
    (fnum % 2 != 0 && fnum != 1 && fnum != 11 && fnum != 13) || fnum == 12

  const svg = select('#neck')
    .append('svg')
    .attr('viewBox', [0, 0, width, height])
    .style('border', '1px dotted #333')

  const openf = svg
    .append('g')
    .attr('transform', (d) => `translate(${margin.l / 2}, ${margin.t})`)
    .attr('font-size', 12)

  const opens = openf
    .selectAll('.open')
    .data(openNotes)
    .join('g')
    .attr('transform', (d, i) => `translate(0, ${sy(i) + 6})`)
    .attr('class', 'open')

  opens.append('text').text((d) => Note.get(d).pc)

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

  const str = frets
    .selectAll('.string')
    .data((d) => d)
    .join('g')
    .attr('transform', (d, i) => `translate(0, ${sy(i)})`)

  str
    .append('rect')
    .attr('width', fx.bandwidth() + 5)
    .attr('height', (d, i) => sw(i))
    .attr('fill', '#333')

  // str
  //   .append('circle')
  //   .attr('r', noteRad)
  //   .attr('cx', fx.bandwidth() / 2)
  //   .attr('cy', 1)
  //   .attr('fill', '#eee')

  str
    .append('rect')
    .attr('width', noteRad * 2)
    .attr('height', noteRad)
    .attr('x', fx.bandwidth() / 2 - (noteRad * 2) / 2)
    .attr('y', -noteRad)
    .attr('fill', '#e1e1e1')

  str
    .append('text')
    .attr('x', fx.bandwidth() / 2)
    .attr('y', -5)
    .attr('text-anchor', 'middle')
    .attr('font-size', 8)
    .attr('fill', '#555')
    .text((d) => Note.get(d).pc)

  const labels = frets
    .append('g')
    .attr(
      'transform',
      `translate(${fx.bandwidth() / 2}, ${fheight + margin.b / 2})`
    )
    .attr('text-anchor', 'middle')
    .attr('font-size', 10)

  labels.append('text').text((d, i) => i + 1)

  frets.each(function (d, i) {
    const fnum = i + 1
    if (getsMark(fnum)) {
      select(this)
        .append('text')
        .text(fnum == 12 ? '··' : '·')
        .attr('text-anchor', 'middle')
        .attr('font-size', 38)
        .attr('font-family', 'sans-serif')
        .attr('fill', '#333')
        .attr('x', fx.bandwidth() / 2)
        .attr('y', margin.t / 2 - 5)
    }
  })
})
