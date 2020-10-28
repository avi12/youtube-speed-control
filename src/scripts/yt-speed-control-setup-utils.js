"use strict";

const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const initial = {
  speed: 1,
  // Used for the options.js
  get iSpeed() {
    return speeds.indexOf(this.speed);
  }
};

/**
 * Used for asynchronous Promise-based storage retrieval.
 * @param {string} storageArea `local` or `sync`.
 * @param {string} key The data name to retrieve from the storage. Not providing it will instead return the entire object stored in `storageArea`.
 * @returns {Promise<any | object>} The data storage for the given `key` & `storageArea`, or the entire data object for the given `storageArea`.
 */
async function getStorage(storageArea, key = null) {
  return new Promise(resolve => {
    chrome.storage[storageArea].get(key, result => {
      resolve(key ? result[key] : result);
    });
  });
}

/**
 * A handy helper function for handling i18n.
 * @param {string} id The ID of the string, as present in `_locales/LANG/messages.json`
 * @param {string} fallback If no value is present in the `messages.json` for the current browser's language, it will be used instead.
 * @returns {string} The string, either from `chrome.i18n.getMessage(...)` or from the `fallback`.
 */
function i18n(id, fallback) {
  return (id && chrome.i18n.getMessage(id)) || fallback || "";
}

/**
 * Retrieving elements by using a `MutationObserver`.
 * @param {string} selector The query selector of the element.
 * @returns {Promise<HTMLElement>} The element, as soon as it exists in the document.
 */
async function getElementByObserver(selector) {
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
