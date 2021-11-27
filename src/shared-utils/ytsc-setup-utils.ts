import type { SpeedRate } from "../types";

export const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

export const initial = {
  speed: 1,
  speedRate: {
    increment: 0.25,
    decrement: 0.25
  } as SpeedRate,
};

export const MIN_PLAYBACK = 0.0625;
export const MAX_PLAYBACK = 16;

export const MIN_SPEED_RATE = 0;
export const MAX_SPEED_RATE = 16;

export async function getStorage(storageArea: "local" | "sync", key = null): Promise<any> {
  return new Promise(resolve => {
    chrome.storage[storageArea].get(key, result => {
      resolve(key ? result[key] : result);
    });
  });
}

/**
 * Returning a playback rate that the browser [can work with](https://stackoverflow.com/a/32320020) without throwing an error.
 * @returns If the speed is between `MIN_PLAYBACK` (0.0625) and `MAX_PLAYBACK` (16), returning the speed argument.
 * Otherwise, returning the value that it's closer to.
 */
export function getCompatibleValue(speed: number | string): number {
  speed = Number(speed);
  if (speed <= MIN_PLAYBACK) {
    return MIN_PLAYBACK;
  }

  if (speed > MAX_PLAYBACK) {
    return MAX_PLAYBACK;
  }

  return speed;
}

export function getIsValueCompatible(speed: string | number): boolean {
  speed = Number(speed);
  return speed >= MIN_PLAYBACK && speed <= MAX_PLAYBACK;
}

/**
 * Retrieving elements by using a [`MutationObserver`](https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver).
 */
async function getElementByObserver(selector: string): Promise<Element> {
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

function isElementVisible(element: Element): boolean {
  const element1 = <HTMLElement>element;
  return element1.offsetWidth > 0 && element1.offsetHeight > 0;
}

function getVisibleElement(elements: NodeListOf<Element>): Element {
  for (const element of elements) {
    if (isElementVisible(element)) {
      return element;
    }
  }
}

export async function getElementEventually(selector: string): Promise<Element> {
  const elements = document.querySelectorAll(selector);
  return (
    (elements.length > 0 && getVisibleElement(elements)) ||
    (await getElementByObserver(selector))
  );
}

export function getErrorMessage(min: number, max: number): string {
  return `Must be between ${min} and ${max}`;
}

export function getInputTitle(min: number, max: number): string {
  return `Please enter a number between ${min} and ${max}`;
}


export function preventNegative(e: KeyboardEvent): void {
  if (e.key === "-") {
    e.preventDefault();
  }
}

export function preventDecrease(e: KeyboardEvent): void {
  const target = e.target as HTMLInputElement;
  if (e.key === "ArrowDown" && Number(target.value) - 1 < 0) {
    e.preventDefault();
  }
}
