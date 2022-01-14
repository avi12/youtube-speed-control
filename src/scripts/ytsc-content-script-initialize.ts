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
  const keyMapper = {
    Comma: "<",
    Period: ">"
  };

  document.addEventListener("keydown", async e => {
    const elVideo = (await getElementEventually("video")) as HTMLVideoElement;
    const isPressedToChangeSpeed =
      Boolean(e.key.match(/[<>]/)) || (Boolean(e.code.match(/Comma|Period/)) && e.shiftKey);
    const isFocusedOnInput =
      document.activeElement.matches("input") ||
      document.activeElement.getAttribute("contenteditable") === "true";

    if (elVideo && isPressedToChangeSpeed && !isFocusedOnInput) {
      const key = e.key.match(/[<>]/)?.[0] ?? keyMapper[e.code.match(/Comma|Period/)?.[0]];
      window.ytscIsSetSpeedByStorage = false;
      await changeSpeedManuallyIfNeeded(elVideo, key);
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
