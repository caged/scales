<script>
  import { setContext } from "svelte";
  import player from "./player.js";

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
