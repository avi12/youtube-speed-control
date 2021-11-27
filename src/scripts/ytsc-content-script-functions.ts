import {
  getCompatibleValue,
  getElementEventually,
  getStorage,
  initial,
  MAX_PLAYBACK,
  MIN_PLAYBACK
} from "../shared-utils/ytsc-setup-utils";
import type { SpeedRate } from "../types";

export async function prepareToChangeSpeed() {
  const speed = await getSpeed();
  await setSpeedToCurrentVideo(speed);
  await updatePlaybackRateText();
}

export async function getSpeed(): Promise<number> {
  let speed = window.ytscLastSpeedSet || initial.speed;
  try {
    speed = (await getStorage("local", "speed")) || speed;
    window.ytscLastSpeedSet = getCompatibleValue(speed);
    // eslint-disable-next-line no-empty
  } catch {}
  // Handling "Error: Extension context invalidated"
  // It typically occurs when the extension receives an update
  // but the user hasn't refreshed the page yet
  return window.ytscLastSpeedSet;
}

async function getSpeedRate(): Promise<SpeedRate> {
  let speedRate = window.ytscLastSpeedRateSet || initial.speedRate;
  try {
    speedRate = (await getStorage("local", "speedRate")) || speedRate;
    window.ytscLastSpeedRateSet = speedRate;
    // eslint-disable-next-line no-empty
  } catch {}
  // Handling "Error: Extension context invalidated"
  // It typically occurs when the extension receives an update
  // but the user hasn't refreshed the page yet
  return window.ytscLastSpeedRateSet;
}

async function setSpeedToCurrentVideo(speed: number) {
  const elVideo = (await getElementEventually("video")) as HTMLVideoElement;
  elVideo.playbackRate = speed;
  await updatePlaybackRateText(elVideo);
}

export async function updatePlaybackRateText(elVideo?: HTMLVideoElement | Event) {
  elVideo = ((<Event>elVideo)?.target ??
    elVideo ??
    (await getElementEventually("video"))) as HTMLVideoElement;

  const elSpeedIndicator = await getElementEventually("#yt-speed");
  elSpeedIndicator.textContent = elVideo.playbackRate.toFixed(2) + "x";
}

export async function changeSpeedManuallyIfNeeded(elVideo: HTMLVideoElement, newRate: "<" | ">"): Promise<void> {
  const slower = "<";
  const faster = ">";

  const speedRate = await getSpeedRate();

  const mapKeyToAction = {
    [slower]: () =>
      setSpeedToCurrentVideo(getCompatibleValue(window.ytscLastSpeedSet - speedRate.decrement)),
    [faster]: () =>
      setSpeedToCurrentVideo(getCompatibleValue(window.ytscLastSpeedSet + speedRate.increment))
  };
  const isTooMuch = {
    [slower]: window.ytscLastSpeedSet - speedRate.decrement < MIN_PLAYBACK,
    [faster]: window.ytscLastSpeedSet + speedRate.increment > MAX_PLAYBACK
  };

  if (isTooMuch[newRate]) {
    return;
  }

  await mapKeyToAction[newRate]();
  window.ytscLastSpeedSet = elVideo.playbackRate;
}
