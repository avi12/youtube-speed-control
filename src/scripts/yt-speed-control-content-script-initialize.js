"use strict";

let gContentScript;

// Get the speed and the content from "yt-speed-control-script-to-inject.js"
Promise.all([getStorage("local", "speed"), getScriptContent()]).then(
  ([speed = initial.speed, contentScript]) => {
    // Save the content of the JS in memory so
    // it can be reused in the storage onChanged listener
    gContentScript = contentScript;

    // The speed value is being communicated
    // to the injected script via this data attribute
    document.documentElement.dataset.ytSpeedControl = speed.toString();
    injectScript(contentScript);
  }
);

getElementByObserver("title").then(elTitle => {
  // Determining when a page navigation occurs
  // by observing the title's change
  const observerPageNavigation = new MutationObserver(async () => {
    const speed = (await getStorage("local", "speed")) ?? initial.speed;
    document.documentElement.dataset.ytSpeedControl = speed.toString();
    injectScript(gContentScript);
  });
  observerPageNavigation.observe(elTitle, {
    childList: true,
    subtree: true
  });
});

chrome.storage.onChanged.addListener(storage => {
  const speed = storage.speed.newValue;
  document.documentElement.dataset.ytSpeedControl = speed.toString();
});

async function getScriptContent() {
  return new Promise(resolve => {
    const port = chrome.runtime.connect({ name: "" });
    port.postMessage("");
    port.onMessage.addListener(resolve);
  });
}

function injectScript(content) {
  const idScript = `${chrome.runtime.id}-yt-speed-control-script`;
  // Adding the script only if doesn't exist already, just in case
  if (document.getElementById(idScript)) {
    return;
  }
  const elScript = document.createElement("script");
  elScript.id = idScript;
  elScript.textContent = content;
  document.head.append(elScript);
}
