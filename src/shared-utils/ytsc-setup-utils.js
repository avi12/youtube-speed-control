"use strict";

export const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const initial = {
  speed: 1
};

export const MIN_PLAYBACK = 0.0625;
export const MAX_PLAYBACK = 16;

/**
 * Used for asynchronous Promise-based storage retrieval.
 * @param {"local"|"sync"} storageArea
 * @param {string} key The data name to retrieve from the storage. Not providing it will instead return the entire object stored in `storageArea`.
 * @returns {Promise<any | object>} The data storage for the given `key` & `storageArea`, or the entire data object for the given `storageArea`.
 */
export async function getStorage(storageArea, key = null) {
  return new Promise(resolve => {
    chrome.storage[storageArea].get(key, result => {
      resolve(key ? result[key] : result);
    });
  });
}

/**
 * Returning a playback rate that the browser [can work with](https://stackoverflow.com/a/32320020) without throwing an error.
 * @param {number|string} speed
 * @returns {number} If the speed is between `MIN_PLAYBACK` (0.0625) and `MAX_PLAYBACK` (16), returning the speed argument.
 * Otherwise, returning the value that it's closer to.
 */
export function getCompatibleValue(speed) {
  speed = Number(speed);
  if (speed <= MIN_PLAYBACK) {
    return MIN_PLAYBACK;
  }

  if (speed > MAX_PLAYBACK) {
    return MAX_PLAYBACK;
  }

  return speed;
}

/**
 * @param {string} speed
 */
export function getIsValueCompatible(speed) {
  speed = Number(speed);
  return speed >= MIN_PLAYBACK && speed <= MAX_PLAYBACK;
}

/**
 * Retrieving elements by using a [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).
 * @param {string} selector The query selector of the element.
 * @returns {Promise<HTMLElement>} The element, as soon as it exists in the document.
 */
export async function getElementByObserver(selector) {
  return new Promise(resolve => {
    const observerHtml = new MutationObserver((_, observer) => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });
    observerHtml.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  });
}
