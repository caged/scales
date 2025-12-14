<script>
  import { onMount } from "svelte";
  import { Chord, Note } from "tonal";
  import { scale as getScale, tnps, pentatonic } from "../frets/index";
  import KeySelector from "./KeySelector.svelte";
  import ScaleSelector from "./ScaleSelector.svelte";
  import FretBoard from "./FretBoard.svelte";
  import ScaleInfo from "./ScaleInfo.svelte";
  import PositionSelector from "./PositionSelector.svelte";
  import TuningSelector from "./TuningSelector.svelte";
  import ScaleChords from "./ScaleChords.svelte";
  import NotePlayer from "./NotePlayer.svelte";
  import AppContext from "./AppContext.svelte";
  import Metronome from "./Metronome.svelte";
  import { tonic, tuning } from "./store";

  let scaleLabel = "minor";
  let position;
  let chordName;
  let loaded = false;

  onMount(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const savedTuning = params.get("tuning");
      const savedTonic = params.get("key");
      const savedScaleLabel = params.get("scale");
      const savedPosition = params.get("position");

      if (savedTuning) {
        try {
          tuning.set(JSON.parse(savedTuning));
        } catch (e) {
          console.error(e);
        }
      }
      if (savedTonic) tonic.set(savedTonic);
      if (savedScaleLabel) scaleLabel = savedScaleLabel;
      if (savedPosition) {
        try {
          position = JSON.parse(savedPosition);
        } catch (e) {
          console.error(e);
        }
      }

      loaded = true;
    }
  });

  $: if (loaded) {
    const params = new URLSearchParams(window.location.search);
    if ($tuning) params.set("tuning", JSON.stringify($tuning));
    if ($tonic) params.set("key", $tonic);
    if (scaleLabel) params.set("scale", scaleLabel);
    if (position !== undefined)
      params.set("position", JSON.stringify(position));
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  }

  function handleChordChange(chord) {
    chordName = chord;
  }

  $: scaleName = `${$tonic} ${scaleLabel}`;
  $: scale = getScale(scaleName);
  $: system = scale.intervals().length === 5 ? pentatonic : tnps;
  $: aliases = scale.aliases();
  $: chord = Chord.getChord(
    chordName,
    Note.get($tuning[0]).height > Note.get(`${$tonic}2`).height
      ? `${$tonic}3`
      : `${$tonic}2`,
  );
  $: notes = chord.notes.map(Note.get);
</script>

<svelte:head>
  <title>{scaleName}</title>
  <meta name="Description" content="{scaleName} guitar scale" />
  <html lang="en"></html>
</svelte:head>

<AppContext>
  <div class="flex flex-wrap md:flex-nowrap border-b border-gray-300">
    <div
      class="p-5 w-1/2 md:w-auto border-r border-b sm:border-b-0 border-gray-200"
    >
      <h3 class="mb-2 font-bold">Tuning</h3>
      <TuningSelector defaultTuning={$tuning} />
    </div>
    <div
      class="p-5 w-1/2 md:w-auto border-r border-b sm:border-b-0 border-gray-200"
    >
      <h3 class="mb-2 font-bold">Key</h3>
      <div><KeySelector key={$tonic} /></div>
    </div>
    <div
      class="p-5 pb-6 w-1/2 md:w-96 border-r border-b sm:border-b-0 border-gray-200"
    >
      <h3 class="font-bold mb-2">Scale</h3>
      <div><ScaleSelector bind:value={scaleLabel} /></div>
    </div>
    <div
      class="p-5 w-1/2 md:w-auto border-r border-b sm:border-b-0 border-gray-200"
    >
      <h3 class="mb-2 font-bold">Position</h3>
      <PositionSelector {scale} bind:position />
    </div>
    <div class="p-5 w-1/2 md:w-auto border-r border-gray-200">
      <Metronome />
    </div>
  </div>
  <div>
    {#if scaleLabel != ""}
      <div class="flex border-b border-gray-200 bg-gray-50 space-x-10">
        <div class="flex flex-1 flex-col border-r border-gray-200">
          <div class="p-5 border-b border-gray-200">
            <h1 class="text-3xl font-bold i capitalize">
              <span class="underline">{$tonic.replace("b", "♭")}</span>
              <span>{scaleLabel} scale</span>
            </h1>
            {#if aliases.length > 0}
              <span class="text-sm text-gray-400"
                >Also known as
                <span class="capitalize">{aliases}</span>
              </span>
            {/if}
          </div>
          <div class="p-5">
            <h3 class="font-bold">Notes and intervals</h3>
            <ScaleInfo bind:scale bind:position />
          </div>
        </div>
        <div class="p-5 hidden lg:block w-2/3">
          <h3 class="font-bold mb-2">Chords</h3>
          <ScaleChords onchordchange={handleChordChange} {scale} />
        </div>
      </div>
    {/if}
    <div class="py-10">
      <FretBoard
        bind:scale
        bind:system
        bind:position
        tuning={$tuning}
        bind:notes
      />
    </div>
    <NotePlayer bind:notes />
  </div>
</AppContext>
