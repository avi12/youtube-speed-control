import { getElementEventually } from "../shared-utils/ytsc-setup-utils";
import {
  changeSpeedManuallyIfNeeded,
  prepareToChangeSpeed,
  updatePlaybackRateText
} from "./ytsc-content-script-functions";

window.ytscLastSpeedSet = null;
window.ytscLastSpeedRateSet = null;

const gObserverOptions = {
  childList: true,
  subtree: true
};

function addNavigationListener() {
  const observerPageNavigation = new MutationObserver(addTemporaryBodyListener);
  const elTitle = document.querySelector("title");
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
    const elVideo = await getElementEventually("video");
    if (!elVideo) {
      return;
    }

    observer.disconnect();

    window.ytscLastSpeedSet = null;
    window.ytscLastSpeedRateSet = null;
    injectPlaybackText();

    await prepareToChangeSpeed();
    addPlaybackListener(elVideo);
  }).observe(document.documentElement, gObserverOptions);
}

function addStorageListener() {
  chrome.storage.onChanged.addListener(() => {
    if (!window.ytscLastSpeedSet) {
      prepareToChangeSpeed();
    }
  });
}

function addKeyboardListener() {
  document.addEventListener("keydown", async e => {
    /** @type {HTMLVideoElement} */
    const elVideo = await getElementEventually("video");
    const isPressedToChangeSpeed = e.key === "<" || e.key === ">";
    const isFocusedOnInput =
      document.activeElement.matches("input") ||
      document.activeElement.getAttribute("contenteditable") === "true";

    if (elVideo && isPressedToChangeSpeed && !isFocusedOnInput) {
      await changeSpeedManuallyIfNeeded(elVideo, e.key);
    }
  });
}

function init() {
  addTemporaryBodyListener();
  addNavigationListener();
  addStorageListener();
  addKeyboardListener();
  prepareToChangeSpeed();
}

init();
