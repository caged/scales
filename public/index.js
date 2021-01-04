'use strict'
import { Note, Scale, Range, Mode } from '@tonaljs/tonal'
import { select, range, scaleBand, scalePoint, scaleLinear, zip } from 'd3'
import { tnps } from '/dist/index'

class FretData {
  constructor(tuning) {
    this.tuning = tuning.split('')
    this.notes = this.tuning.map((t) =>
      Range.chromatic([`${t}0`, `${t}2`], { flats: true })
    )
  }

  between(start, fin) {
    const notes = this.notes.reduce((out, c) => {
      out.push(c.slice(start, fin + 1))
      return out
    }, [])
    return zip(...notes)
  }
}

const tuning = 'EADGBE'
const fd = new FretData(tuning)

function draw() {
  const positions = document.querySelectorAll('.scale')
  const width = positions[0].offsetWidth
  const height = positions[0].offsetHeight

  function render(el) {
    const margin = { t: 0, r: 0, b: 0, l: 0 }
    // Numerical position of three note per string, caged, or mode
    const pos = Number(el.dataset.pos)
    // start fret to render where 0 is the open position
    const start = pos - 1
    // finish fret to end on.  Alwqys render 7
    const fin = pos - 1 + 6
    // Get fret note data between the start and fin frets
    const fdata = fd.between(start, fin)

    const isHeadStock = (el, i) => el.datum() == 1 && i == 0

    // Lay out frets horizontally
    const fretX = scaleBand()
      .domain(range(fdata.length))
      .range([margin.l, width - margin.r])
      .padding(0.0)

    // Lay out strings and notes vertically
    const fretY = scalePoint()
      .domain(range(tuning.length))
      .rangeRound([height, 0])
      .padding(0.5)

    // Vary thickness of strings
    const stringThickness = scaleLinear()
      .domain([0, tuning.length])
      .range([4, 1])

    const svg = select(el)
      .append('svg')
      .attr('viewBox', [0, 0, width, height])
      .style('border', '1px solid #ccc')
      .style('border-radius', '3px')
      .style('font', '0.8rem sans-serif')

    const fretGroup = svg.append('g').datum(pos)

    const frets = fretGroup
      .selectAll('.fret')
      .data(fdata)
      .join('g')
      .attr('transform', (_, i) => `translate(${fretX(i)}, ${margin.t})`)
      .attr('class', 'fret')

    // Fret background
    frets
      .append('rect')
      .attr('width', fretX.bandwidth())
      .attr('height', height - margin.t - margin.b)
      .attr('fill', '#f9f9f9')
      .attr('rx')

    // Fret bars
    frets
      .filter((_, i) => !!(i != fdata.length - 1))
      .append('rect')
      .attr('width', 1)
      .attr('height', height - margin.t - margin.b)
      .attr('x', fretX.bandwidth() - 1)
      .attr('fill', '#ccc')

    // Draw headstock
    if (pos == 1) {
      fretGroup
        .append('rect')
        .attr('x', fretX.bandwidth() - 1)
        .attr('width', 6)
        .attr('height', height - margin.t - margin.b)
        .attr('fill', '#333')

      const labels = fretGroup
        .selectAll('.note')
        .data(tuning.split(''))
        .join('g')
        .attr('transform', (d, i) => `translate(0, ${fretY(i)})`)

      labels
        .append('text')
        .attr('x', fretX.bandwidth())
        .attr('dx', -fretX.bandwidth() / 2)
        .attr('text-anchor', 'end')
        .attr('dominant-baseline', 'middle')
        .text(String)
    }

    const strings = frets
      .filter(function (d, i, e) {
        // First fret of  first position is the open strings
        return !isHeadStock(select(this.parentNode), i)
      })
      .selectAll('.string')
      .data((d) => d)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${fretY(i)})`)
      .attr('class', 'string')

    // Offset these just a little to draw over the fret bars
    strings
      .append('rect')
      .attr('x', -1)
      .attr('width', fretX.bandwidth() + 1)
      .attr('height', (d, i) => stringThickness(i))
      .attr('fill', '#444')
  }

  for (let container of positions) {
    render(container)
  }

  // for (let position = 0; position < 7; position++) {
  //   // console.log(getIntervalsAtPosition(6, scale, position))
  //   console.log(tnps.getNotesAtPosition(6, Scale.get('D minor'), position))
  // }
}

setTimeout(draw, 10)
