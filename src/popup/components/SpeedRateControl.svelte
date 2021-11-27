<script lang="ts">
  import type { SpeedRate } from "../../types";
  import {
    getErrorMessage,
    getInputTitle,
    initial,
    MAX_SPEED_RATE,
    MIN_SPEED_RATE,
    preventDecrease,
    preventNegative
  } from "../../shared-utils/ytsc-setup-utils";
  import { TextField } from "svelte-materialify";

  export let speedRate: SpeedRate = initial.speedRate;

  $: chrome.storage.local.set({
    speedRate: {
      decrement: isSpeedRateWithinRange(speedRate.decrement)
        ? Number(speedRate.decrement)
        : initial.speedRate.decrement,
      increment: isSpeedRateWithinRange(speedRate.increment)
        ? Number(speedRate.increment)
        : initial.speedRate.increment
    }
  });

  const hintSpeedRate = {
    decrement: `By pressing "<"`,
    increment: `By pressing ">"`
  };

  function isSpeedRateWithinRange(speedRate) {
    speedRate = Number(speedRate);
    return speedRate > MIN_SPEED_RATE && speedRate <= MAX_SPEED_RATE - 1;
  }

  $: errorSpeedRateDecrement =
    speedRate.decrement !== "" && isSpeedRateWithinRange(speedRate.decrement)
      ? hintSpeedRate.decrement
      : getErrorMessage(MIN_SPEED_RATE, MAX_SPEED_RATE) + " (excluding)";

  $: errorSpeedRateIncrement =
    speedRate.increment !== "" && isSpeedRateWithinRange(speedRate.increment)
      ? hintSpeedRate.increment
      : getErrorMessage(MIN_SPEED_RATE, MAX_SPEED_RATE) + " (excluding)";
</script>

<div class="speed-rate">
  <TextField
    bind:value={speedRate.decrement}
    class="speed-rate__input--width"
    color={errorSpeedRateDecrement !== hintSpeedRate.decrement ? "error" : "secondary"}
    dense
    messages={errorSpeedRateDecrement}
    on:keydown={preventDecrease}
    on:keypress={preventNegative}
    outlined
    title={`${getInputTitle(MIN_SPEED_RATE, MAX_SPEED_RATE)} (excluding)`}
    type="number"
  >
    Decrement speed
  </TextField>

  <TextField
    bind:value={speedRate.increment}
    class="speed-rate__input--width"
    color={errorSpeedRateIncrement !== hintSpeedRate.increment ? "error" : "secondary"}
    dense
    messages={errorSpeedRateIncrement}
    on:keydown={preventDecrease}
    on:keypress={preventNegative}
    outlined
    title={`${getInputTitle(MIN_SPEED_RATE, MAX_SPEED_RATE)} (excluding)`}
    type="number"
    >Increment speed
  </TextField>
</div>

<style>
  .speed-rate {
    display: flex;
    gap: 10px;
    padding: 0 15px 15px;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.speed-rate__input--width) {
    align-items: start;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.speed-rate__input--width .s-input__control) {
    max-width: 196px;
  }
</style>
