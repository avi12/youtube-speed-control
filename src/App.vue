<template>
  <v-app :class="{ 'body-shift-right': isFirefox }">
    <h2 class="red--text my-4 font-weight-medium">YouTube Speed Control</h2>
    <v-slider
      :max="labelSpeedsReversed.length - 1"
      :thumb-color="isSpeedCustom ? 'transparent' : ''"
      :tick-labels="labelSpeedsReversed"
      :value="iSpeedReversed"
      class="flex-grow-0 margin-right--match"
      tick-size="5"
      vertical
      @change="setSpeed"
    ></v-slider>

    <v-radio-group
      :value="isSpeedCustom"
      class="mx-auto mb-4 mt-0"
      hide-details
      row
      @change="isSpeedCustom = true"
    >
      <v-radio :value="true">
        <template v-slot:label>
          <v-text-field
            :value="speedCustom"
            label="Custom"
            type="number"
            @input="setCustomSpeed"
          ></v-text-field>
        </template>
      </v-radio>
    </v-radio-group>
  </v-app>
</template>

<script>
import { speeds } from "@/extension/content/yt-speed-control-setup-utils";

export default {
  name: "App",
  props: {
    pSpeed: Number
  },
  data(vm) {
    return {
      iSpeed: vm.pISpeed,
      iSpeedReversed: "", // Default: Normal
      speedsReversed: [...speeds].reverse(),
      // Reversing because Vuetify is flipping the array
      // Spreading because Vuetify mutates the array for some reason
      speedCustom: vm.pSpeed,
      isSpeedCustom: speeds.indexOf(vm.speedCustom) === -1
    };
  },
  watch: {
    speedCustom(speed) {
      chrome.storage.local.set({ speed });
    },
    iSpeedReversed(iSpeedReversed) {
      const iSpeed = this.speedsReversed.length - iSpeedReversed - 1;
      const speed = speeds[iSpeed];
      chrome.storage.local.set({ speed });
    }
  },
  computed: {
    labelSpeedsReversed() {
      return this.speedsReversed.map(speed => {
        if (speed === 1) {
          return "Normal";
        }
        return speed;
      });
    },
    isFirefox() {
      return chrome.runtime.getURL("").startsWith("moz-extension://");
    }
  },
  methods: {
    setSpeed(iSpeedReversed) {
      this.isSpeedCustom = false;
      this.iSpeedReversed = iSpeedReversed;
      const iSpeed = this.speedsReversed.length - iSpeedReversed - 1;
      this.speedCustom = speeds[iSpeed];
    },
    setCustomSpeed(speedCustom) {
      this.speedCustom = Number(speedCustom);
      this.isSpeedCustom = true;
      const iSpeed = speeds.indexOf(this.speedCustom);
      const isSpeedInArray = iSpeed > -1;
      if (isSpeedInArray) {
        this.iSpeedReversed = this.speedsReversed.length - iSpeed - 1;
      }
    }
  },
  created() {
    this.speedCustom = this.pSpeed;
    const iSpeed = speeds.indexOf(this.speedCustom);
    if (iSpeed > -1) {
      this.iSpeedReversed = this.speedsReversed.length - iSpeed - 1;
      this.isSpeedCustom = false;
    } else {
      this.isSpeedCustom = true;
    }
  }
};
</script>

<style scoped>
.margin-right--match {
  margin-right: 110px;
}
</style>

<style>
/* Hide the scrollbar on Firefox */
html {
  scrollbar-width: none;
}

/*
* Since the scrollbar is hidden but still occupying space,
* my solution is to just shift the body to the right
*/
body .body-shift-right {
  margin-right: -20px;
}

/*noinspection CssUnusedSymbol*/
#app {
  font-family: system-ui, sans-serif;
  text-align: center;
  width: 18em;
  font-size: 17px;
}

/*noinspection CssUnusedSymbol*/
.thumb--invisible .v-slider__thumb:before {
  opacity: 0 !important;
}

/*noinspection CssUnusedSymbol*/
.v-slider--vertical {
  margin-bottom: 0;
}

/*noinspection CssUnusedSymbol*/
.v-application--wrap {
  min-height: 100%;
}

/*noinspection CssUnusedSymbol*/
.v-label {
  width: 87px;
}
</style>
