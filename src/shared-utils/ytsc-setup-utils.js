"use strict";

export const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const initial = {
  speed: 1,
  speedRate: {
    increment: 0.25,
    decrement: 0.25
  }
};

export const MIN_PLAYBACK = 0.0625;
export const MAX_PLAYBACK = 16;

export const MIN_SPEED_RATE = 0;
export const MAX_SPEED_RATE = 16;

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
async function getElementByObserver(selector) {
  return new Promise(resolve => {
    const observerHtml = new MutationObserver((_, observer) => {
      const elements = document.querySelectorAll(selector);
      const element = getVisibleElement(elements);
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

/**
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isElementVisible(element) {
  return element.offsetWidth > 0 && element.offsetHeight > 0;
}

/**
 * @param {NodeListOf} elements
 * @returns {HTMLElement|undefined}
 */
function getVisibleElement(elements) {
  for (const element of elements) {
    if (isElementVisible(element)) {
      return element;
    }
  }
}


/**
 * @param {string} selector
 * @returns {Promise<HTMLElement>}
 */
export async function getElementEventually(selector) {
  const elements = document.querySelectorAll(selector);
  return (
    (elements.length > 0 && getVisibleElement(elements)) ||
    (await getElementByObserver(selector))
  );
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export function getErrorMessage(min, max) {
  return `Must be between ${min} and ${max}`;
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {string}
 */
export function getInputTitle(min, max) {
  return `Please enter a number between ${min} and ${max}`;
}
