import { Note, Scale, Range, Mode } from '@tonaljs/tonal'
import { select, range, scaleBand, scalePoint, scaleLinear } from 'd3'

// console.log(Scale.names(), Scale.get('c0 harmonic minor'))
// console.log(Mode.get('minor').intervals.map(Note.transposeFrom('D')))
const notes = Mode.notes('minor', 'D')

const positions = [
  { nps: [3, 3, 2, 3, 3], idx: 5 },
  { nps: [3, 3, 3, 2, 3], idx: 6 },
  { nps: [3, 3, 3, 2, 3], idx: 8 },
  { nps: [3, 2, 3, 3, 3], idx: 9 },
  { nps: [2, 2, 2, 2, 2], idx: 0 },
  { nps: [3, 3, 2, 3, 3], idx: 1 },
  { nps: [3, 3, 2, 3, 3], idx: 3 },
]

const noteData = positions.map((p, i) => {
  let oct = notes.concat(notes)
  oct.unshift(...oct.splice(i))
  return p.nps.reduce((cv, nps) => {
    cv.push(oct.splice(0, nps))
    return cv
  }, [])
})

document.addEventListener('DOMContentLoaded', () => {
  const margin = { t: 20, r: 10, b: 30, l: 40 }
  const posWidth = 400
  const height = 100
  const fheight = height - margin.t - margin.b
  const tuning = ['D', 'A', 'D', 'G', 'B', 'E']
  const notes = tuning.map((t) =>
    Range.chromatic([`${t}0`, `${t}2`], { flats: true }).map(Note.get)
  )

  const px = scaleBand()
    .domain(range(6))
    .rangeRound([margin.l, posWidth - margin.r])

  const sy = scalePoint()
    .domain(range(tuning.length))
    .rangeRound([fheight, 0])
    .padding(0.5)

  const svg = select('#neck')
    .append('svg')
    .attr('style', 'border: 1px solid #333')
    .attr('viewBox', [0, 0, posWidth, height])

  const str = svg
    .selectAll('.string')
    .data((d, i) => {
      // TODO: 6th string fuckery fix
      const nd = notes.map((n) => n.splice(positions[i], i + 1 === 4 ? 6 : 5))
      console.log(nd)
      return nd
    })
    .join('g')
    .attr('transform', (d, i) => `translate(0, ${sy(i)})`)

  console.log(noteData)
})
