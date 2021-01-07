import { zip } from 'd3'
import utils from '../utils'

const getAtPosition = (items, strings, scale, position) => {
  const out = []
  const itemset = utils.rotate(scale[items], position)
  for (let string = 0; string < strings; string++) {
    out.push(utils.chunk(itemset, (string * 3) % itemset.length, 3))
  }
  return out
}

// const tuning = ['E', 'A', 'D', 'G', 'B', 'E']
// const scale = Scale.get('minor')
// const positions = 7
//
// strings - number of strings
// scale - A tonal Scale object
// position - A number 1..7 representing which 3nps scale position
const getIntervalsAtPosition = (strings, scale, position) => {
  const intervals = []
  const intset = utils.rotate(scale.intervals, position)
  for (let string = 0; string < strings; string++) {
    intervals.push(utils.chunk(intset, (string * 3) % intset.length, 3))
  }
  return intervals
}

//
// strings - number of strings
// scale - A tonal Scale object
// position - A number 1..7 representing which 3nps scale position
const getNotesAtPosition = (strings, scale, position) => {
  const notes = []
  const noteset = utils.rotate(scale.notes, position)
  for (let string = 0; string < strings; string++) {
    notes.push(utils.chunk(noteset, (string * 3) % noteset.length, 3))
  }
  return notes
}

export default { getIntervalsAtPosition, getNotesAtPosition }

// for (let position = 0; position < positions; position++) {
//   // console.log(getIntervalsAtPosition(6, scale, position))
//   console.log(getNotesAtPosition(6, Scale.get('D minor'), position))
// }
