<script>
  import { onMount, setContext } from "svelte";
  import { tonic, tuning } from "./store";
  import player from "./player";

  export let volume = 0.5;

  const globalPlayer = player();
  globalPlayer.volume(volume);

  setContext("app", {
    player: globalPlayer,
  });
</script>

<div>
  <slot />
</div>
