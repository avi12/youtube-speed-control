<script lang="ts">
  import { MaterialAppMin } from "svelte-materialify/dist";
  import SpeedControl from "./SpeedControl.svelte";
  import SpeedRateControl from "./SpeedRateControl.svelte";

  export let speedCustom;
  export let speedRate;
</script>

<MaterialAppMin>
  <h5 class="red-text mt-4 text-center">YouTube Speed Control</h5>

  <SpeedControl {speedCustom} />
  <SpeedRateControl {speedRate} />
</MaterialAppMin>

<style>
  :global(body) {
    user-select: none;
    width: 300px;
    height: unset !important;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.s-text-field) {
    margin-top: -10px;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.s-text-field__wrapper.outlined:focus-within::before) {
    border-width: 1px !important;
  }
</style>
