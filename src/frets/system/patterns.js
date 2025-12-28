// CAGED shape patterns for guitar fretboard position systems
// These patterns define which scale degrees appear on each string for each CAGED shape
// Strings are in reversed order: [high E, B, G, D, A, low E]
//
// Scale degrees are 1-5 for pentatonic or 1-7 for diatonic

// Pentatonic patterns (2 notes per string)
// Used by both Pentatonic and CAGED position systems for 5-note scales
export const pentatonicPatterns = {
  C: [
    [4, 5], // High E string: 5th, m7/6th
    [2, 3], // B string: 2nd, 4th
    [5, 1], // G string: m7/6th, root
    [3, 4], // D string: 4th, 5th
    [1, 2], // A string: root, 2nd
    [4, 5], // Low E string: 5th, m7/6th
  ],
  A: [
    [5, 1], // High E string: m7/6th, root
    [3, 4], // B string: 4th, 5th
    [1, 2], // G string: root, 2nd
    [4, 5], // D string: 5th, m7/6th
    [2, 3], // A string: 2nd, 4th
    [5, 1], // Low E string: m7/6th, root
  ],
  G: [
    [1, 2], // High E string: root, 2nd
    [4, 5], // B string: 5th, m7/6th
    [2, 3], // G string: 2nd, 4th
    [5, 1], // D string: m7/6th, root
    [3, 4], // A string: 4th, 5th
    [1, 2], // Low E string: root, 2nd
  ],
  E: [
    [2, 3], // High E string: 2nd, 4th
    [5, 1], // B string: m7/6th, root
    [3, 4], // G string: 4th, 5th
    [1, 2], // D string: root, 2nd
    [4, 5], // A string: 5th, m7/6th
    [2, 3], // Low E string: 2nd, 4th
  ],
  D: [
    [3, 4], // High E string: 4th, 5th
    [1, 2], // B string: root, 2nd
    [4, 5], // G string: 5th, m7/6th
    [2, 3], // D string: 2nd, 4th
    [5, 1], // A string: m7/6th, root
    [3, 4], // Low E string: 4th, 5th
  ],
};

// Scale degrees in 1-7
export const diatonicPatterns = {
  C: [
    [3, 4, 5],
    [7, 1, 2],
    [5, 6],
    [2, 3, 4],
    [6, 7, 1],
    [3, 4, 5],
  ],
  A: [
    [5, 6],
    [2, 3, 4],
    [6, 7, 1],
    [3, 4, 5],
    [7, 1, 2],
    [5, 6],
  ],
  G: [
    [6, 7, 1],
    [3, 4, 5],
    [7, 1, 2],
    [5, 6],
    [2, 3, 4],
    [6, 7, 1],
  ],
  E: [
    [7, 1, 2],
    [5, 6],
    [2, 3, 4],
    [6, 7, 1],
    [3, 4, 5],
    [7, 1, 2],
  ],
  D: [
    [2, 3, 4],
    [6, 7, 1],
    [3, 4, 5],
    [7, 1, 2],
    [5, 6],
    [2, 3, 4],
  ],
};

// Pentatonic box mapping for CAGED to Pentatonic boxes
// Pentatonic: Position 1=G, 2=E, 3=D, 4=C, 5=A
export const pentatonicPositionMapping = {
  1: "G",
  2: "E",
  3: "D",
  4: "C",
  5: "A",
};

// Position mapping based on common CAGED systems
export const cagedPositionMapping = {
  1: "E",
  2: "D",
  3: "C",
  4: "A",
  5: "G",
};
