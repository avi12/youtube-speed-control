import Options from "./components/Options.svelte";

async function init() {
  const { speed: speedCustom, speedRate } = await new Promise(resolve => {
    chrome.storage.local.get(["speed", "speedRate"], resolve);
  });

  new Options({
    target: document.body,
    props: { speedCustom, speedRate }
  });
}

init();
