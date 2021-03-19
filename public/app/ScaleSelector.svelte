<script>
  import Select from "svelte-select";
  import { ScaleType } from "@tonaljs/tonal";

  export let value;

  const scales = ScaleType.all()
    .sort((a, b) => {
      return b.intervals.length - a.intervals.length;
    })
    .map((s) => {
      return { value: s.name, label: s.name };
    });

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
  />
</div>

<style>
  .themed {
    --border: theme("borderWidth.DEFAULT") solid theme("borderColor.gray.300");
    --borderRadius: theme("borderRadius.lg");
    --placeholderColor: theme("colors.gray.500");
  }
</style>
