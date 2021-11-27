<script lang="ts">
  import {
    getErrorMessage,
    getInputTitle,
    getIsValueCompatible,
    initial,
    MAX_PLAYBACK,
    MIN_PLAYBACK,
    preventDecrease,
    preventNegative,
    speeds
  } from "../../shared-utils/ytsc-setup-utils";
  import { Radio, Slider, TextField } from "svelte-materialify";

  export let speedCustom = initial.speed;
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

  const SPACE = " ";

  $: errorSpeedCustom =
    speedCustom !== "" && getIsValueCompatible(speedCustom)
      ? SPACE
      : getErrorMessage(MIN_PLAYBACK, MAX_PLAYBACK);
</script>

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
    messages={errorSpeedCustom}
    on:keydown={preventDecrease}
    on:keypress={preventNegative}
    outlined
    title={getInputTitle(MIN_PLAYBACK, MAX_PLAYBACK)}
    type="number"
  >
    Custom
  </TextField>
</Radio>

<style>
  .labels-container {
    font-size: 12px;
  }

  .labels-container > span:not(:first-child) {
    margin-top: 3.5px;
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
