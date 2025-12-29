// CAGED shape patterns for guitar fretboard position systems
// These patterns define which scale degrees appear on each string for each CAGED shape
// Strings are in reversed order: [high E, B, G, D, A, low E]
//
// Scale degrees are 1-5 for pentatonic or 1-7 for diatonic

// Pentatonic patterns (2 notes per string)
// Used by both Pentatonic and CAGED position systems for 5-note scales
// Scale degrees are 1-6
export const pentatonicPatterns = {
  C: [
    [3, 5],
    [1, 2],
    [5, 6],
    [2, 3],
    [6, 1],
    [3, 5],
  ],
  A: [
    [5, 6],
    [2, 3],
    [6, 1],
    [3, 5],
    [1, 2],
    [5, 6],
  ],
  G: [
    [6, 1],
    [3, 5],
    [1, 2],
    [5, 6],
    [2, 3],
    [6, 1],
  ],
  E: [
    [1, 2],
    [5, 6],
    [2, 3],
    [6, 1],
    [3, 5],
    [1, 2],
  ],
  D: [
    [2, 3],
    [6, 1],
    [3, 5],
    [1, 2],
    [5, 6],
    [2, 3],
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
