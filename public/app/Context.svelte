<script>
  import { onMount, setContext } from "svelte";
  import player from "./player";

  export let tuning = "E2 A2 D3 G3 B3 E4".split(" ");
  export let tonic = "A";

  const globalPlayer = player();
  setContext("player", {
    player: globalPlayer,
    tonic,
    tuning,
  });
</script>

<div>
  <slot />
</div>
