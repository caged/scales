import { Note, Scale, Range, Mode } from '@tonaljs/tonal'
import { select, range, scaleBand, scalePoint, scaleLinear } from 'd3'

// console.log(Scale.names(), Scale.get('c0 harmonic minor'))
// console.log(Mode.get('minor').intervals.map(Note.transposeFrom('D')))
const scalenotes = Scale.rangeOf('E major')('E0', 'E2').map(Note.get)

document.addEventListener('DOMContentLoaded', () => {
  const margin = { t: 20, r: 10, b: 30, l: 40 }
  const width = window.innerWidth
  const height = Math.round(width / 5)
  const fheight = height - margin.t - margin.b
  const tuning = ['E', 'A', 'D', 'G', 'B', 'E']
  const notes = tuning.map((t) =>
    Range.chromatic([`${t}0`, `${t}2`], { flats: true }).map(Note.get)
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

  const openf = svg
    .append('g')
    .attr('transform', (d) => `translate(${margin.l / 2}, ${margin.t})`)
    .attr('font-size', 12)

  const opens = openf
    .selectAll('.open')
    .data(openNotes)
    .join('g')
    .attr('transform', (_, i) => `translate(0, ${sy(i) + 6})`)
    .attr('class', 'open')

  opens
    .append('rect')
    .attr('width', noteRad * 1.5)
    .attr('height', noteRad * 1.5)
    .attr('x', 2)
    .attr('y', -noteRad)
    .attr('fill', (d) => {
      return scalenotes.some((sn) => sn.chroma === d.chroma)
        ? '#C48400'
        : '#eee'
    })

  opens
    .append('text')
    .attr('text-anchor', 'middle')
    .attr('x', noteRad / 1.5)
    .text((d) => d.pc)

  // const frets = svg
  //   .selectAll('.fret')
  //   .data(fretData)
  //   .join('g')
  //   .attr('transform', (d) => `translate(${fx(d)}, ${margin.t})`)
  //   .attr('class', 'fret')

  // frets
  //   .append('rect')
  //   .attr('width', fx.bandwidth())
  //   .attr('height', height - margin.t - margin.b)
  //   .attr('fill', '#eee')

  // const str = frets
  //   .selectAll('.string')
  //   .data((d) => d)
  //   .join('g')
  //   .attr('transform', (d, i) => `translate(0, ${sy(i)})`)

  // str
  //   .append('rect')
  //   .attr('width', fx.bandwidth() + 5)
  //   .attr('height', (d, i) => sw(i))
  //   .attr('fill', '#8E5F00')

  // str
  //   .append('rect')
  //   .attr('width', noteRad * 1.5)
  //   .attr('height', noteRad)
  //   .attr('x', fx.bandwidth() / 2 - (noteRad * 1.5) / 2)
  //   .attr('y', -noteRad)
  //   .attr('fill', (d) => {
  //     return scalenotes.includes(d) ? '#C48400' : '#eee'
  //   })

  // str
  //   // .filter((d) => scalenotes.includes(d))
  //   .append('text')
  //   .attr('x', fx.bandwidth() / 2)
  //   .attr('y', -4)
  //   .attr('text-anchor', 'middle')
  //   .attr('font-size', 10)
  //   .attr('fill', (d) =>
  //     scalenotes.some((sn) => sn.chroma === d.chroma) ? '#fff' : '#333'
  //   )
  //   .text((d) => d.pc.replace('b', '♭'))

  // const labels = frets
  //   .append('g')
  //   .attr(
  //     'transform',
  //     `translate(${fx.bandwidth() / 2}, ${fheight + margin.b / 2})`
  //   )
  //   .attr('text-anchor', 'middle')
  //   .attr('font-size', 10)

  // labels.append('text').text((d, i) => i + 1)

  // frets.each(function (d, i) {
  //   const fnum = i + 1
  //   if (getsMark(fnum)) {
  //     select(this)
  //       .append('text')
  //       .text(fnum == 12 ? '··' : '·')
  //       .attr('text-anchor', 'middle')
  //       .attr('font-size', 38)
  //       .attr('font-family', 'sans-serif')
  //       .attr('fill', '#333')
  //       .attr('x', fx.bandwidth() / 2)
  //       .attr('y', margin.t / 2 - 5)
  //   }
  // })
})
