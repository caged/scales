'use strict'
import { Note, Scale, Range, Mode } from '@tonaljs/tonal'
import {
  select,
  selectAll,
  range,
  scaleBand,
  scalePoint,
  scaleLinear,
  zip,
} from 'd3'
import { tnps } from '/dist/index'

const isNotesEqual = (a, b) =>
  [b, Note.enharmonic(b)].includes(Note.pitchClass(a))

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
    return zip(...notes).map((d, i) => {
      return { fret: start + i, data: d }
    })
  }

  // This is kinda nasty.  Essentially looks at each string's note pitch to determine
  // the fret start and end for each position range
  //
  // scale - Scale object
  // position -  1-7 of a three note per string scale
  getFretRangeForScaleAndPosition(scale, position) {
    const snotes = tnps.getNotesAtPosition(
      this.tuning.length,
      scale,
      position - 1
    )

    const topString = this.notes[0]
    const botString = this.notes[this.notes.length - 1]
    const [snotesTop, snotesBot] = [snotes[0], snotes[snotes.length - 1]]
    const firstScaleNote = snotesTop[0]
    const lastScaleNote = snotesBot[snotesBot.length - 1]

    const sindex = topString.findIndex((n) => isNotesEqual(n, firstScaleNote))
    const first = position === 7 && sindex === 0 ? 12 : sindex

    let last =
      first >= 6
        ? first + 6
        : botString.findIndex((n) => Note.pitchClass(n) == lastScaleNote)

    if (last > 12) last--
    console.log(first, last)
    return [first, last]
  }
}

var params = new URLSearchParams(location.search)
const scaleString = params.has('scale') ? params.get('scale') : 'F major'

const tuning = 'EADGBE'
const fd = new FretData(tuning)
const scale = Scale.get(scaleString)

console.log(Note)

function draw() {
  const positions = document.querySelectorAll('.scale')
  const width = positions[0].offsetWidth
  const height = positions[0].offsetHeight

  function render(el) {
    const margin = { t: 40, r: 0, b: 40, l: 0 }
    // Numerical position of three note per string, caged, or mode
    const pos = Number(el.dataset.pos)

    const [start, fin] = fd.getFretRangeForScaleAndPosition(scale, pos)
    // Get fret note data between the start and fin frets
    const fdata = fd.between(start, fin)
    const scaleNotes = tnps.getNotesAtPosition(fd.tuning.length, scale, pos - 1)

    const isHeadStock = (el, i) => el.datum() == 1 && i == 0

    const getsMark = (fnum) =>
      (fnum % 2 != 0 && fnum != 1 && fnum != 11 && fnum != 13) || fnum == 12

    // Lay out frets horizontally
    const fretX = scaleBand()
      .domain(range(fdata.length))
      .range([margin.l, width - margin.r])
      .padding(0.0)

    // Lay out strings and notes vertically
    const fretY = scalePoint()
      .domain(range(tuning.length))
      .rangeRound([height - margin.t - margin.b, 0])
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

    const figure = svg
      .append('g')
      .attr('transform', `translate(${width / 2}, ${margin.t / 2})`)
      .attr('class', 'figure')

    figure
      .append('text')
      .attr('fill', '#777')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(`Position ${pos}`)

    const fretGroup = svg.append('g').datum(pos)

    const frets = fretGroup
      .selectAll('.fret')
      .data(fdata)
      .join('g')
      .attr('transform', (_, i) => `translate(${fretX(i)}, ${margin.t})`)
      .attr('class', 'fret')

    // Fret background
    frets
      .filter((d) => d.fret !== 0)
      .append('rect')
      .attr('width', fretX.bandwidth())
      .attr('height', height - margin.t - margin.b)
      .attr('fill', '#f9f9f9')

    // Fret bars
    frets
      .filter((_, i) => !!(i != fdata.length - 1))
      .append('rect')
      .attr('width', (d) => (d.fret === 0 ? 5 : 1))
      .attr('height', height - margin.t - margin.b)
      .attr('x', (d) =>
        d.fret == 0 ? fretX.bandwidth() - 5 : fretX.bandwidth() - 1
      )
      .attr('fill', '#ccc')

    frets
      .filter((d) => getsMark(d.fret))
      .append('circle')
      .attr('cx', fretX.bandwidth() / 2)
      .attr('cy', (height - margin.t - margin.b) / 2 + 4 / 2)
      .attr('r', 4)
      .attr('fill', '#ccc')

    frets
      .filter((d) => getsMark(d.fret))
      .append('text')
      .attr('y', height - margin.t - margin.b)
      .attr('dy', margin.b / 2)
      .attr('x', fretX.bandwidth() / 2)
      .attr('fill', '#555')
      .style('font-size', '0.6rem')
      .text((d) => d.fret)

    frets
      .filter((d) => d.fret === 0)
      .selectAll('.tuning')
      .data(fd.tuning)
      .join('text')
      .attr('y', (d, i) => fretY(i))
      .attr('x', fretX.bandwidth() / 2)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .text(String)

    const strings = frets
      .selectAll('.string')
      .data((d) => d.data)
      .join('g')
      .attr('transform', (d, i) => `translate(0, ${fretY(i)})`)
      .attr('class', 'string')

    // Offset these just a little to draw over the fret bars
    strings
      .filter(function (d) {
        const pdata = select(this.parentNode).datum()
        return pdata.fret !== 0
      })
      .append('rect')
      .attr('x', -1)
      .attr('width', fretX.bandwidth() + 1)
      .attr('height', (d, i) => stringThickness(i))
      .attr('fill', '#444')

    strings
      .append('text')
      .attr('fill', '#ccc')
      .text((d) => Note.pitchClass(d))

    // console.log(Note.get('Gb'), Note.get('F#'))

    // This is terrible becase strings are grouped by frets, but the scale note
    // data is grouped by string. Remedying this will require rearchitecting.
    strings.each(function (d, i) {
      const el = select(this)
      const note = Note.pitchClass(d)
      const snotes = scaleNotes[i]

      if (isNotesEqual(note, snotes[0])) {
        const snote = snotes.shift()
        const snoteg = el
          .append('g')
          .attr('transform', `translate(${fretX.bandwidth() / 2})`)

        snoteg
          .append('circle')
          .attr('cy', 2)
          .attr('r', 10)
          .attr('stroke', snote === scale.tonic ? '#FE54C1' : 'black')
          .attr('stroke-width', snote === scale.tonic ? 2 : 1)
        snoteg
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('dy', 3)
          .attr('fill', snote === scale.tonic ? '#FE54C1' : '#fff')
          .attr('font-weight', snote === scale.tonic ? 'bold' : 'normal')
          .attr('font-size', '0.7rem')
          .text(snote)
      }
    })
  }

  for (let container of positions) {
    render(container)
  }
}

setTimeout(draw, 10)
