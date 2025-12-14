<script>
  import Select from "svelte-select";
  import { ScaleType } from "tonal";

  export let value;

  const allScales = ScaleType.all();
  const commonScales = [
    "major",
    "minor",
    "major pentatonic",
    "minor pentatonic",
    "phrygian",
    "lydian",
    "mixolydian",
    "locrian",
    "dorian",
    "blues",
    "harmonic minor",
    "phrygian dominant",
  ].map((name) => {
    return { group: "Popular", ...ScaleType.get(name) };
  });

  const otherScales = allScales
    .filter(
      (a) =>
        !commonScales.find((b) => {
          return b.setNum == a.setNum;
        }),
    )
    .map((s) => {
      return { ...s, group: "Other" };
    });

  const scales = [...commonScales, ...otherScales].map((s) => {
    return {
      label: `${s.name}${s.aliases.length ? " (" + s.aliases[0] + ")" : ""}`,
      value: s.name,
      group: s.group,
    };
  });

  const groupBy = (s) => s.group;

  function handleSelect(event) {
    value = event.detail.value;
  }

  function handleClear() {
    value = "";
  }

  $: selectedItem = scales.find((s) => s.value === value);
</script>

<div class="themed w-full">
  <Select
    items={scales}
    placeholder="Select a scale..."
    on:select={handleSelect}
    on:clear={handleClear}
    containerClasses="text-sm"
    containerStyles="text-transform: capitalize"
    value={selectedItem}
    {groupBy}
  />
</div>

<style>
  .themed {
    --border: 1px solid rgb(209 213 219);
    --borderRadius: 0.5rem;
    --placeholderColor: rgb(107 114 128);
    --height: 2.75rem;
  }
</style>
