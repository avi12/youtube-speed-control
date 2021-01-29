import Vue from "vue";
import Vuetify from "vuetify/lib/framework";
import { mdiRadioboxMarked, mdiRadioboxBlank } from "@mdi/js";

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      radioOn: mdiRadioboxMarked,
      radioOff: mdiRadioboxBlank
    }
  }
});
