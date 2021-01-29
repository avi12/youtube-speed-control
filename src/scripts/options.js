/* global
    chrome
    getStorage
    i18n
    initial
    Vue
*/

"use strict";

new Vue({
  el: "#app",
  vuetify: new Vuetify(),
  data: {
    iSpeedReversed: 4, // Default: Normal
    // Reversing because Vuetify is flipping the array
    // Spreading because for some reason, Vuetify mutates the array
    speedsReversed: [...speeds].reverse(),
    isOfferRate: false,
    isOfferSupport: false,
    i18n: {
      labelLikeHeader: i18n("", "Like this extension?"),
      labelRate: i18n("", "Please rate 5 stars!"),
      labelAlsoSupport: i18n("", "Also, consider supporting the development!"),
      labelSupport: i18n("", "Consider supporting the development!")
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
    browser() {
      const extensionBaseUrl = chrome.runtime.getURL("");
      if (extensionBaseUrl.startsWith("moz-extension://")) {
        return "firefox";
      }
      const { userAgent } = navigator;
      if (userAgent.includes("OPR")) {
        return "opera";
      }
      if (userAgent.includes("Edg")) {
        return "edge";
      }
      return "chrome";
    },
    // prettier-ignore
    linkRating() {
      const urls = {
        chrome: `https://chrome.google.com/webstore/detail/${i18n("@@extension_id")}/reviews`,
        opera:"https://addons.opera.com/en/extensions/details/youtube-speed-control",
        firefox: `https://addons.mozilla.org/firefox/addon/youtube-speed-control-1`,
        edge: `https://microsoftedge.microsoft.com/addons/detail/${i18n("@@extension_id")}`
      };

      return urls[this.browser];
    }
  },
  methods: {
    async hideElement(type) {
      new Promise(resolve => {
        this[type] = false;
        chrome.storage.sync.set({ [type]: false }, resolve);
      });
    },
    async clickListener(e) {
      const { target: elA } = e;
      if (!elA.href) {
        return;
      }
      e.preventDefault();

      let { offer } = elA.dataset;
      if (offer) {
        offer = offer[0].toUpperCase() + offer.slice(1);
        await this.hideElement(`isOffer${offer}`);
      }
      chrome.tabs.create({ url: elA.href });
    }
  },
  async created() {
    document.addEventListener("click", this.clickListener);

    const [
      iSpeed = initial.iSpeed,
      { isOfferRate = true, isOfferSupport = true }
    ] = await Promise.all([getStorage("local", "iSpeed"), getStorage("sync")]);

    this.isOfferSupport = isOfferSupport;
    this.isOfferRate = isOfferRate;
    this.iSpeedReversed = this.speedsReversed.length - iSpeed - 1;

    this.$watch("iSpeedReversed", iSpeedReversed => {
      const iSpeed = this.speedsReversed.length - iSpeedReversed - 1;
      const speed = speeds[iSpeed];
      chrome.storage.local.set({ iSpeed, speed });
    });
  }
});
