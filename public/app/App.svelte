<script>
  import { getContext, onMount } from "svelte";
  import { Chord, Note } from "@tonaljs/tonal";
  import { scale as getScale, tnps } from "../dist/index";
  import Tailwind from "./Tailwind.svelte";
  import KeySelector from "./KeySelector.svelte";
  import ScaleSelector from "./ScaleSelector.svelte";
  import FretBoard from "./FretBoard.svelte";
  import ScaleInfo from "./ScaleInfo.svelte";
  import PositionSelector from "./PositionSelector.svelte";
  import TuningSelector from "./TuningSelector.svelte";
  import ScaleChords from "./ScaleChords.svelte";
  import NotePlayer from "./NotePlayer.svelte";
  import Context from "./Context.svelte";

  let key = "A";
  let scaleLabel = "minor";
  let system = tnps;
  let position;
  let chordName;
  let selectedTuning = "E2 A2 D3 G3 B3 E4";

  function handleChordChange(event) {
    chordName = event.detail;
  }

  $: scaleName = `${key} ${scaleLabel}`;
  $: scale = getScale(scaleName);
  $: tuning = selectedTuning.split(" ");
  $: chord = Chord.getChord(
    chordName,
    Note.get(tuning[0]).height > Note.get(`${key}2`).height
      ? `${key}3`
      : `${key}2`
  );
  $: notes = chord.notes.map(Note.get);
</script>

<svelte:head>
  <title>{scaleName}</title>
  <meta name="Description" content="{scaleName} guitar scale" />
  <html lang="en" />
</svelte:head>

<Context {tuning} tonic={key}>
  <div class="flex border-b border-gray-300">
    <div class="p-5 border-r border-gray-200">
      <h3 class="mb-2 font-bold">Tuning</h3>
      <div><TuningSelector bind:value={selectedTuning} /></div>
    </div>
    <div class="p-5 border-r border-gray-200">
      <h3 class="mb-2 font-bold">Key</h3>
      <div><KeySelector bind:key /></div>
    </div>
    <div class="w-1/4 p-5 pb-6 border-r border-gray-200">
      <h3 class="font-bold mb-2">Scale</h3>
      <div><ScaleSelector bind:value={scaleLabel} /></div>
    </div>
    <div class="p-5">
      <h3 class="mb-2 font-bold">Position</h3>
      <PositionSelector {system} bind:position />
    </div>
  </div>
  <div>
    {#if scaleLabel != ""}
      <div class="flex border-b border-gray-200 bg-gray-50 space-x-10">
        <div class="p-5  flex-initial">
          <h1 class="font-bold text-2xl">{key} {scaleLabel} scale</h1>
          <span class="text-sm text-gray-500 capitalize">{scale.aliases()}</span
          >
        </div>
        <div class="w-1/3  p-5">
          <h3 class="font-bold">Notes and intervals</h3>
          <ScaleInfo bind:scale />
        </div>
        <div class="p-5">
          <h3 class="font-bold">Chords</h3>
          <ScaleChords on:chordchange={handleChordChange} {scale} {tuning} />
        </div>
      </div>
    {/if}
    <div class="py-10">
      <FretBoard bind:scale bind:system bind:position bind:tuning bind:notes />
    </div>
    <NotePlayer bind:notes />
  </div>
</Context>
