import { getElementByObserver } from "../shared-utils/ytsc-setup-utils";
import {
  addKeyboardListener,
  prepareToChangeSpeed,
  setSpeedToCurrentVideo,
  updatePlaybackRateText
} from "./ytsc-content-script-functions";

window.ytscLastSpeedSet = null;

const gObserverOptions = {
  childList: true,
  subtree: true
};

async function addNavigationListener() {
  const observerPageNavigation = new MutationObserver(addTemporaryBodyListener);
  const elTitle = await getElementByObserver("title");
  observerPageNavigation.observe(elTitle, gObserverOptions);
}

function addPlaybackListener(elVideo) {
  elVideo.addEventListener("ratechange", updatePlaybackRateText);
}

function injectPlaybackText() {
  const elRightControls = document.querySelector(".ytp-right-controls");
  const idSpeed = "yt-speed";
  if (document.getElementById(idSpeed)) {
    return;
  }

  const elSpeed = document.createElement("span");
  elSpeed.id = idSpeed;
  elSpeed.className = "ytp-button";
  elRightControls.prepend(elSpeed);
}

function addTemporaryBodyListener() {
  new MutationObserver(async (_, observer) => {
    const elVideo = await getElementByObserver("video");
    if (!elVideo) {
      return;
    }

    observer.disconnect();
    injectPlaybackText();

    await prepareToChangeSpeed();
    addPlaybackListener(elVideo);
  }).observe(document.documentElement, gObserverOptions);
}

function addStorageListener() {
  chrome.storage.onChanged.addListener(setSpeedToCurrentVideo);
}

function init() {
  addTemporaryBodyListener();
  addNavigationListener();
  addStorageListener();
  addKeyboardListener();
  prepareToChangeSpeed();
}

init();
