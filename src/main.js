import Vue from "vue";
import App from "@/App.vue";
import vuetify from "@/plugins/vuetify";
import {
  getStorage,
  initial
} from "@/extension/content/yt-speed-control-setup-utils";

Vue.config.productionTip = false;

async function init() {
  const speed = (await getStorage("local", "speed")) ?? initial.speedCustom;

  new Vue({
    vuetify,
    render: h =>
      h(App, {
        props: { pSpeed: speed }
      })
  }).$mount("#app");
}

init();
