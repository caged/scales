<script>
  import { page } from "$app/stores";

  const key = $derived($page.params.key);
  const scale = $derived($page.params.scale.replace("-", " "));
</script>

<div>
  Key: {key} | Scale: {scale}
</div>
