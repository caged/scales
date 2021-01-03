import { Note, Scale, Range, Mode } from '@tonaljs/tonal'
import { chunk, rotate } from '../utils'

const tuning = ['E', 'A', 'D', 'G', 'B', 'E']
const scale = Scale.get('major')
const intervals = scale.intervals
const positions = 7

for (let position = 0; position < positions; position++) {
  const notes = []
  const intset = rotate(intervals, position)
  for (let [string, note] of tuning.entries()) {
    notes.push(chunk(intset, (string * 3) % intset.length, 3))
  }
  console.log(position + 1, notes)
}
