"use strict";

chrome.runtime.onConnect.addListener(port => {
  port.onMessage.addListener(() => {
    fetch("yt-speed-control-script-to-inject.js")
      .then(res => res.text())
      .then(content => {
        port.postMessage(content);
      });
  });
});
