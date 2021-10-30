<script>
  import { MaterialAppMin, Slider, TextField, Radio } from "svelte-materialify";
  import {
    getIsValueCompatible,
    initial,
    MAX_PLAYBACK,
    MIN_PLAYBACK,
    speeds
  } from "../../shared-utils/ytsc-setup-utils";

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

  const speedCustomError =
    speedCustom !== "" && getIsValueCompatible(speedCustom)
      ? " "
      : `Must be between ${MIN_PLAYBACK} and ${MAX_PLAYBACK}`;

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
      color="secondary"
      dense
      messages={speedCustomError}
      on:keypress={preventNegative}
      on:keydown={preventDecrease}
      type="number"
    >
      Custom
    </TextField>
  </Radio>
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
