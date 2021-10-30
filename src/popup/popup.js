import Options from "./components/Options.svelte";
import { getStorage } from "../shared-utils/ytsc-setup-utils.js";

async function init() {
  const speedCustom = await getStorage("local", "speed");

  new Options({
    target: document.body,
    props: { speedCustom }
  });
}

init();
