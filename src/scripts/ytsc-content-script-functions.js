import {
  getCompatibleValue,
  getElementByObserver,
  getStorage,
  initial,
  MAX_PLAYBACK,
  MIN_PLAYBACK
} from "../shared-utils/ytsc-setup-utils";

export async function prepareToChangeSpeed() {
  const speed = await getSpeed();
  await setSpeedToCurrentVideo(speed);
}

async function getSpeed() {
  try {
    const speed = (await getStorage("local", "speed")) ?? initial.speed;
    window.ytscLastSpeedSet = getCompatibleValue(speed);
  } catch {
    return window.ytscLastSpeedSet;
  }
}

/**
 * @param {number|StorageEvent} speed
 */
export async function setSpeedToCurrentVideo(speed) {
  speed = typeof speed === "number" ? speed : window.ytscLastSpeedSet;

  const elVideo = document.querySelector("video");
  elVideo.playbackRate = speed;
  updatePlaybackRateText(elVideo);
}

export async function updatePlaybackRateText(elVideo) {
  elVideo = elVideo?.target ?? elVideo;
  (await getElementByObserver("#yt-speed")).textContent = elVideo.playbackRate.toFixed(2) + "x";
}

function getIsFocusedOnInput() {
  const isCommentFocused = document.activeElement.getAttribute("contenteditable") === "true";
  return document.activeElement.matches("input") || isCommentFocused;
}

/**
 * @param {string} key
 * @returns {boolean}
 */
function getIsPressedSpeedChange(key) {
  return key === "<" || key === ">";
}

/**
 * @param {HTMLVideoElement} elVideo
 * @param {string} newRate
 * @returns {Promise<void>}
 */
async function changeSpeedIfNeeded(elVideo, newRate) {
  const speedRate = (await getStorage("local", "speedRate")) ?? initial.speedRate;
  const mapKeyToAction = {
    "<": () => setSpeedToCurrentVideo(window.ytscLastSpeedSet - speedRate.decrement),
    ">": () => setSpeedToCurrentVideo(window.ytscLastSpeedSet + speedRate.increment)
  };
  const isTooSlow =
    newRate === "<" && window.ytscLastSpeedSet - speedRate.decrement < MIN_PLAYBACK;
  const isTooFast =
    newRate === ">" && window.ytscLastSpeedSet + speedRate.increment > MAX_PLAYBACK;
  if (isTooSlow || isTooFast) {
    return;
  }

  mapKeyToAction[newRate]();
  window.ytscLastSpeedSet = elVideo.playbackRate;
}

export function addKeyboardListener() {
  addEventListener(
    "keydown",
    async e => {
      const elVideo = await getElementByObserver("video");
      if (!elVideo || !getIsPressedSpeedChange(e.key) || getIsFocusedOnInput()) {
        return;
      }

      changeSpeedIfNeeded(elVideo, e.key);
    }
  );
}
