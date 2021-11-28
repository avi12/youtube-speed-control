import { getElementEventually } from "../shared-utils/ytsc-setup-utils";
import {
  changeSpeedManuallyIfNeeded,
  prepareToChangeSpeed,
  updatePlaybackRateText
} from "./ytsc-content-script-functions";
import type { SpeedRate } from "../types";

declare global {
  interface Window {
    ytscLastSpeedSet: number;
    ytscLastSpeedRateSet: SpeedRate;
    ytscIsSetSpeedByStorage: boolean;
  }
}

window.ytscLastSpeedSet = null;
window.ytscLastSpeedRateSet = null;
window.ytscIsSetSpeedByStorage = true;

const gObserverOptions = {
  childList: true,
  subtree: true
};

function addNavigationListener(): void {
  const observerPageNavigation = new MutationObserver(addTemporaryBodyListener);
  const elTitle = document.querySelector("title");
  observerPageNavigation.observe(elTitle, gObserverOptions);
}

function addPlaybackRateListener(elVideo): void {
  elVideo.addEventListener("ratechange", updatePlaybackRateText);
}

function injectPlaybackText(): void {
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

function addTemporaryBodyListener(): void {
  new MutationObserver(async (_, observer) => {
    const elVideo = await getElementEventually("video");
    if (!elVideo) {
      return;
    }

    observer.disconnect();

    window.ytscLastSpeedSet = null;
    window.ytscLastSpeedRateSet = null;
    window.ytscIsSetSpeedByStorage = true;
    injectPlaybackText();

    await prepareToChangeSpeed();
    addPlaybackRateListener(elVideo);
  }).observe(document.documentElement, gObserverOptions);
}

function addStorageListener(): void {
  chrome.storage.onChanged.addListener(() => {
    if (window.ytscIsSetSpeedByStorage) {
      prepareToChangeSpeed();
    }
  });
}

function addKeyboardListener(): void {
  document.addEventListener("keydown", async e => {
    const elVideo = await getElementEventually("video") as HTMLVideoElement;
    const isPressedToChangeSpeed = e.key === "<" || e.key === ">";
    const isFocusedOnInput =
      document.activeElement.matches("input") ||
      document.activeElement.getAttribute("contenteditable") === "true";

    if (elVideo && isPressedToChangeSpeed && !isFocusedOnInput) {
      window.ytscIsSetSpeedByStorage = false;
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
