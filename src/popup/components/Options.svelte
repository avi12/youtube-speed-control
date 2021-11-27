<script lang="ts">
  import { MaterialAppMin, Radio, Slider, TextField } from "svelte-materialify/dist";
  import {
    getErrorMessage,
    getInputTitle,
    getIsValueCompatible,
    initial,
    MAX_PLAYBACK,
    MAX_SPEED_RATE,
    MIN_PLAYBACK,
    MIN_SPEED_RATE,
    speeds
  } from "../../shared-utils/ytsc-setup-utils";

  export let speedCustom = initial.speed;
  export let speedRate = initial.speedRate;
  let iSpeed = (() => {
    const isSpeedInArray = speeds.indexOf(speedCustom) > -1;
    if (isSpeedInArray) {
      return speeds.indexOf(speedCustom);
    }

    return speedCustom;
  })();

  // For some reason, the <Slider>'s "on:update" fires twice on load,
  // therefore combating this behavior by using this counter
  let countISpeedChanged = 0;

  function setISpeed(iSpeed) {
    if (countISpeedChanged > 1) {
      speedCustom = speeds[iSpeed];
    }

    countISpeedChanged++;
  }

  $: isSpeedCustom = speeds.indexOf(Number(speedCustom)) === -1;

  $: if (!isSpeedCustom) {
    iSpeed = speeds.indexOf(Number(speedCustom));
  }

  $: if (getIsValueCompatible(speedCustom)) {
    chrome.storage.local.set({ speed: Number(speedCustom) });
  }

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

  const SPACE = " ";
  $: errorSpeedCustom =
    speedCustom !== "" && getIsValueCompatible(speedCustom)
      ? SPACE
      : getErrorMessage(MIN_PLAYBACK, MAX_PLAYBACK);

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

  function preventNegative(e) {
    if (e.key === "-") {
      e.preventDefault();
    }
  }

  function preventDecrease(e) {
    if (e.key === "ArrowDown" && e.target.value - 1 < 0) {
      e.preventDefault();
    }
  }
</script>

<MaterialAppMin>
  <h5 class="red-text mt-4 text-center">YouTube Speed Control</h5>

  <div class="d-flex flex-row justify-center">
    <div class="mt-5 mr-3">
      <Slider
        color="secondary"
        max={speeds.length - 1}
        on:update={e => setISpeed(Number(e.detail.value[0]))}
        step={1}
        value={iSpeed}
        vertical
      />
    </div>
    <div class="d-flex flex-column mt-3 labels-container">
      {#each speeds as speed, i}
        <span on:click={() => setISpeed(i)}>
          {#if speed === 1}
            Normal
          {:else}
            {speed}
          {/if}
        </span>
      {/each}
    </div>
  </div>

  <!-- Causes the radio button to be checked only if the speed is custom -->
  <Radio group={isSpeedCustom} value={true}>
    <TextField
      autofocus
      bind:value={speedCustom}
      color={errorSpeedCustom !== SPACE ? "error" : "secondary"}
      dense
      outlined
      messages={errorSpeedCustom}
      on:keydown={preventDecrease}
      on:keypress={preventNegative}
      title={getInputTitle(MIN_PLAYBACK, MAX_PLAYBACK)}
      type="number"
    >
      Custom
    </TextField>
  </Radio>

  <div class="speed-rate">
    <TextField
      bind:value={speedRate.decrement}
      class="speed-rate__input--width"
      color={errorSpeedRateDecrement !== hintSpeedRate.decrement ? "error" : "secondary"}
      dense
      outlined
      messages={errorSpeedRateDecrement}
      on:keydown={preventDecrease}
      on:keypress={preventNegative}
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
      outlined
      messages={errorSpeedRateIncrement}
      on:keydown={preventDecrease}
      on:keypress={preventNegative}
      title={`${getInputTitle(MIN_SPEED_RATE, MAX_SPEED_RATE)} (excluding)`}
      type="number"
      >Increment speed
    </TextField>
  </div>
</MaterialAppMin>

<style>
  :global(body) {
    user-select: none;
    width: 300px;
    height: unset !important;
  }

  .labels-container {
    font-size: 12px;
  }

  .labels-container > span:not(:first-child) {
    margin-top: 3.5px;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.s-text-field) {
    margin-top: -10px;
  }

  .speed-rate {
    display: flex;
    gap: 10px;
    padding: 0 15px 15px;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.speed-rate__input--width.s-input) {
    align-items: start;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.speed-rate__input--width .s-input__control) {
    max-width: 196px;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.s-text-field__wrapper.outlined:focus-within::before) {
    border-width: 1px !important;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.s-radio) {
    justify-content: center;
    padding: 30px 0;
  }

  /*noinspection CssUnusedSymbol*/
  :global(.s-radio__wrapper) {
    margin-bottom: 35px;
  }
</style>
