<script>
  import Select from "svelte-select";
  import { Scale, ScaleType } from "@tonaljs/tonal";

  export let value;

  const allScales = ScaleType.all();
  const commonScales = [
    "minor pentatonic",
    "major pentatonic",
    "minor",
    "major",
    "phrygian",
    "lydian",
    "mixolydian",
    "locrian",
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
        })
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
</script>

<div class="themed w-full">
  <Select
    items={scales}
    placeholder="Select a scale..."
    on:select={handleSelect}
    on:clear={handleClear}
    containerClasses="text-sm"
    containerStyles="text-transform: capitalize"
    selectedValue={value}
    {groupBy}
  />
</div>

<style>
  .themed {
    --border: theme("borderWidth.DEFAULT") solid theme("borderColor.gray.300");
    --borderRadius: theme("borderRadius.lg");
    --placeholderColor: theme("colors.gray.500");
    --height: theme("height.11");
  }
</style>
