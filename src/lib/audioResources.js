import { Howl } from "howler";
import { Range } from "tonal";

// Shared audio file URLs
export const GUITAR_NOTES_URL = "/guitar-notes.mp3";
export const NOTE_CRESCENDO_URL = "/note-crescendo.mp3";
export const METRONOME_URL = "/metronome.mp3";

// Create sprite mapping for guitar notes covering the full chromatic range
const createGuitarNoteSprites = () => {
  // For player.js compatibility (C1-E6)
  const midiRange = Range.numeric(["C1", "E6"]).reduce((acc, cur, i) => {
    acc[cur] = [i * 2000, 2000];
    return acc;
  }, {});

  // For NotePlayer.svelte compatibility (C1-B5 with sharps and flats)
  const noteRangeWithSharps = Range.chromatic(["C1", "B5"], { sharps: true }).reduce(
    (acc, cur, i) => {
      if (!acc[cur]) {
        // Avoid overwriting if already exists
        acc[cur] = [i * 2000, 2000];
      }
      return acc;
    },
    {}
  );

  const noteRangeWithFlats = Range.chromatic(["C1", "B5"], { sharps: false }).reduce(
    (acc, cur, i) => {
      if (!acc[cur]) {
        // Avoid overwriting if already exists
        acc[cur] = [i * 2000, 2000];
      }
      return acc;
    },
    {}
  );

  // Merge all sprite definitions
  return { ...midiRange, ...noteRangeWithSharps, ...noteRangeWithFlats };
};

// Create a single shared Howl instance for guitar notes
let guitarNotesHowl = null;

export function getGuitarNotesHowl() {
  if (!guitarNotesHowl) {
    guitarNotesHowl = new Howl({
      src: GUITAR_NOTES_URL,
      sprite: createGuitarNoteSprites(),
    });
  }
  return guitarNotesHowl;
}
