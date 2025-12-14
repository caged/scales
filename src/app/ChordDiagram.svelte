<script>
  import { SVGuitarChord } from "svguitar";
  import guitar from "@tombatossals/chords-db/lib/guitar.json";
  import { Chord } from "tonal";

  let { chordSymbol = "C" } = $props();
  let container;

  // Parse chord symbol using Tonal to get key and suffix
  function parseChordSymbol(symbol) {
    const chord = Chord.get(symbol);

    if (chord.empty || !chord.tonic) {
      return { key: "C", suffix: "major" };
    }

    const key = chord.tonic;
    let suffix = chord.aliases[0] || chord.type;

    // Map Tonal chord types to chords-db suffixes
    const suffixMap = {
      "": "major",
      "major": "major",
      "minor": "minor",
      "maj7": "maj7",
      "major seventh": "maj7",
      "dominant seventh": "7",
      "minor seventh": "m7",
      "diminished": "dim",
      "augmented": "aug",
      "sus2": "sus2",
      "sus4": "sus4",
      "M": "major",
      "m": "minor",
    };

    suffix = suffixMap[suffix] || suffix;

    return { key, suffix };
  }

  // Convert chords-db format to svguitar format
  function convertToSVGuitarFormat(chordData) {
    if (
      !chordData ||
      !chordData.positions ||
      chordData.positions.length === 0
    ) {
      return null;
    }

    const position = chordData.positions[0]; // Use first position
    const frets = position.frets;
    const fingers = position.fingers;
    const baseFret = position.baseFret || 1;

    const fingerArray = [];
    const barres = [];

    // Convert fret string to finger positions
    for (let i = 0; i < frets.length; i++) {
      const fret = frets[i];
      const stringNum = 6 - i; // svguitar uses string 1 = high E

      if (fret === "x") {
        // Muted string
        fingerArray.push([stringNum, "x"]);
      } else {
        const fretNum = parseInt(fret, 10);
        if (fretNum === 0) {
          // Open string
          fingerArray.push([stringNum, 0]);
        } else {
          fingerArray.push([stringNum, fretNum]);
        }
      }
    }

    return {
      fingers: fingerArray,
      barres: position.barres || [],
      position: baseFret > 1 ? baseFret : 0,
    };
  }

  function findChord(key, suffix) {
    const chords = guitar.chords[key];
    if (!chords) return null;

    return chords.find((c) => c.suffix === suffix);
  }

  function drawChord() {
    if (!container) return;

    container.innerHTML = "";

    const { key, suffix } = parseChordSymbol(chordSymbol);
    const chordData = findChord(key, suffix);
    const svgChord = convertToSVGuitarFormat(chordData);

    if (svgChord) {
      new SVGuitarChord(container)
        .configure({
          style: "normal",
          strings: 6,
          frets: 4,
        })
        .chord(svgChord)
        .draw();
    }
  }

  // Redraw when chord changes
  $effect(() => {
    drawChord();
  });
</script>

<div class="h-20 w-full" bind:this={container}></div>
