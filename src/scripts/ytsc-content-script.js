"use strict";

import {
  getCompatibleValue,
  getElementByObserver,
  getStorage,
  initial
} from "../shared-utils/ytsc-setup-utils";

let gSpeedLast;

const gObserverOptions = {
  childList: true,
  subtree: true
};

async function getSpeed() {
  try {
    const speed = (await getStorage("local", "speed")) ?? initial.speed;
    gSpeedLast = getCompatibleValue(speed);
    // eslint-disable-next-line no-empty
  } catch {}
  return gSpeedLast;
}
async function addNavigationListener() {
  const elTitle = await getElementByObserver("title");
  const observerPageNavigation = new MutationObserver(addTemporaryBodyListener);
  observerPageNavigation.observe(elTitle, gObserverOptions);
}

async function setSpeedToCurrentVideo() {
  const elVideo = document.querySelector("video");
  elVideo.playbackRate = await getSpeed();
  updatePlaybackRateText(elVideo);
}

function updatePlaybackRateText(elVideo) {
  elVideo = elVideo?.target ?? elVideo;
  document.getElementById("yt-speed").textContent =
    elVideo.playbackRate.toFixed(2) + "x";
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
    await setSpeedToCurrentVideo();
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
}

init();
