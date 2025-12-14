# Diatonic Chords in Tonal Library - Summary

## Overview

The Tonal library provides built-in functions to get diatonic chords (chords built on each scale degree). There are three main approaches depending on what type of scale you're working with.

## Best Methods for Getting Diatonic Chords

### 1. **`Key.majorKey(tonic)`** - For Major Keys

Returns comprehensive information about a major key, including diatonic triads and seventh chords.

```javascript
import { Key } from "tonal";

const cMajor = Key.majorKey("C");

console.log(cMajor.triads);
// => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]

console.log(cMajor.chords);  // seventh chords
// => ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"]

console.log(cMajor.grades);
// => ["I", "II", "III", "IV", "V", "VI", "VII"]

console.log(cMajor.chordScales);
// => ["C major", "D dorian", "E phrygian", "F lydian",
//     "G mixolydian", "A minor", "B locrian"]
```

### 2. **`Key.minorKey(tonic)`** - For Minor Keys

Returns three variations: natural, harmonic, and melodic minor with their respective diatonic chords.

```javascript
import { Key } from "tonal";

const aMinor = Key.minorKey("A");

// Natural minor (Aeolian mode)
console.log(aMinor.natural.chords);
// => ["Am7", "Bm7b5", "Cmaj7", "Dm7", "Em7", "Fmaj7", "G7"]

// Harmonic minor
console.log(aMinor.harmonic.chords);
// => ["AmMaj7", "Bm7b5", "C+maj7", "Dm7", "E7", "Fmaj7", "G#o7"]

// Melodic minor
console.log(aMinor.melodic.chords);
// => ["Am6", "Bm7", "C+maj7", "D7", "E7", "F#m7b5", "G#m7b5"]
```

### 3. **`Mode.triads(modeName, tonic)`** and **`Mode.seventhChords(modeName, tonic)`** - For Modal Music

Works with the 7 standard modes: ionian, dorian, phrygian, lydian, mixolydian, aeolian, locrian.

```javascript
import { Mode } from "tonal";

// Get triads for D Dorian
console.log(Mode.triads("dorian", "D"));
// => ["Dm", "Em", "F", "G", "Am", "Bdim", "C"]

// Get seventh chords for D Dorian
console.log(Mode.seventhChords("dorian", "D"));
// => ["Dm7", "Em7", "FMaj7", "G7", "Am7", "Bm7b5", "CMaj7"]

// Also works with "major" and "minor" aliases
console.log(Mode.triads("major", "C"));
// => ["C", "Dm", "Em", "F", "G", "Am", "Bdim"]

console.log(Mode.seventhChords("minor", "A"));
// => ["Am7", "Bm7b5", "CMaj7", "Dm7", "Em7", "FMaj7", "G7"]
```

### 4. **`Scale.scaleChords(scaleName)`** - Gets Chord Types (NOT Diatonic Chords!)

**IMPORTANT**: This function returns chord TYPES that fit within a scale, NOT the diatonic chords built on each scale degree.

```javascript
import { Scale } from "tonal";

// Returns all chord types that can be built from notes in C major
console.log(Scale.scaleChords("C major"));
// => ["5", "sus4", "M7sus4", "M", "maj7", "6", "sus2", ...]

// This is NOT the same as getting I-ii-iii-IV-V-vi-vii°!
```

## Comparison Table

| Function | Works With | Returns | Example Output |
|----------|-----------|---------|----------------|
| `Key.majorKey(tonic).chords` | Major keys only | Diatonic 7th chords | `["Cmaj7", "Dm7", ...]` |
| `Key.minorKey(tonic).natural.chords` | Minor keys only | Natural minor 7th chords | `["Am7", "Bm7b5", ...]` |
| `Mode.seventhChords(mode, tonic)` | 7 standard modes | Diatonic 7th chords | `["Dm7", "Em7", ...]` |
| `Mode.triads(mode, tonic)` | 7 standard modes | Diatonic triads | `["Dm", "Em", ...]` |
| `Scale.scaleChords(scale)` | Any scale | Chord types (not diatonic!) | `["M", "m", "maj7", ...]` |

## The 7 Standard Modes

The Mode functions work with these modes:

1. **Ionian** (aliases: "major")
   - Pattern: I-ii-iii-IV-V-vi-vii°
   - Seventh chords: Maj7-m7-m7-Maj7-7-m7-m7b5

2. **Dorian**
   - Pattern: i-ii-bIII-IV-v-vi°-bVII
   - Seventh chords: m7-m7-Maj7-7-m7-m7b5-Maj7

3. **Phrygian**
   - Pattern: i-bII-bIII-iv-v°-bVI-bvii
   - Seventh chords: m7-Maj7-7-m7-m7b5-Maj7-m7

4. **Lydian**
   - Pattern: I-II-iii-#iv°-V-vi-vii
   - Seventh chords: Maj7-7-m7-m7b5-Maj7-m7-m7

5. **Mixolydian**
   - Pattern: I-ii-iii°-IV-v-vi-bVII
   - Seventh chords: 7-m7-m7b5-Maj7-m7-m7-Maj7

6. **Aeolian** (aliases: "minor")
   - Pattern: i-ii°-bIII-iv-v-bVI-bVII
   - Seventh chords: m7-m7b5-Maj7-m7-m7-Maj7-7

7. **Locrian**
   - Pattern: i°-bII-biii-iv-bV-bVI-bvii
   - Seventh chords: m7b5-Maj7-m7-m7-Maj7-7-m7

## Implementation

A complete implementation with fallbacks for non-standard scales is available in:
- **File**: [src/frets/diatonicChords.js](src/frets/diatonicChords.js)
- **Tests**: [src/frets/diatonicChords.test.js](src/frets/diatonicChords.test.js)

The implementation provides these functions:
- `getDiatonicSeventhChords(scaleName)` - Get seventh chords for any scale
- `getDiatonicTriads(scaleName)` - Get triads for any scale
- `getHarmonicMinorChords(tonic)` - Get harmonic minor chords
- `getMelodicMinorChords(tonic)` - Get melodic minor chords

All functions use the built-in Tonal library features when possible, with manual chord construction as a fallback for non-standard scales.

## Key Takeaways

1. **For major scales**: Use `Key.majorKey(tonic).chords` or `Key.majorKey(tonic).triads`
2. **For minor scales**: Use `Key.minorKey(tonic).natural.chords` (or `.harmonic` / `.melodic`)
3. **For modes**: Use `Mode.seventhChords(mode, tonic)` or `Mode.triads(mode, tonic)`
4. **For other scales**: Build chords manually using `Scale.get()` and `Chord.detect()`
5. **Don't use**: `Scale.scaleChords()` for diatonic chords - it returns chord types, not scale-degree chords

## Example: Getting Diatonic Chords for C Major

```javascript
import { Key, Mode } from "tonal";

// Method 1: Using Key
const chords1 = Key.majorKey("C").chords;
console.log(chords1);
// => ["Cmaj7", "Dm7", "Em7", "Fmaj7", "G7", "Am7", "Bm7b5"]

// Method 2: Using Mode (equivalent)
const chords2 = Mode.seventhChords("major", "C");
console.log(chords2);
// => ["CMaj7", "Dm7", "Em7", "FMaj7", "G7", "Am7", "Bm7b5"]
// Note: "CMaj7" and "FMaj7" have capital M in Mode output

// Both are correct - just slightly different formatting!
```
