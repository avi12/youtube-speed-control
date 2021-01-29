# YouTube Speed Control
A browser extension that lets you control the speed of YouTube videos, even if they're embedded, including changing the speed "on the fly", i.e. changing the speed will immediately affect any videos you're watching.

Available for:
* [Google Chrome](https://chrome.google.com/webstore/detail/dmpbgbehgckaijcpmodinibhkdgbifif) ![Chrome Web Store](https://img.shields.io/chrome-web-store/users/dmpbgbehgckaijcpmodinibhkdgbifif?color=white&label=users&style=flat-square)
* [Mozilla Firefox](https://addons.mozilla.org/addon/youtube-speed-control-1) ![Mozilla Add-on](https://img.shields.io/amo/users/youtube-speed-control-1?color=white&label=users&style=flat-square)
* [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/ipajmlopcjnobogfakhlggainepilahm)
* [Opera](https://addons.opera.com/en/extensions/details/youtube-speed-control)
   
Made by [avi12](https://avi12.com).

### Made with
* [Vue.js](https://vuejs.org)
* [Vuetify](https://vuetifyjs.com)
* [simple-extension](https://github.com/markovroma/vue-cli-plugin-browser-extension)

## Requirements for setting up
Install [Node.js](https://nodejs.org) and [Yarn 1.x](https://classic.yarnpkg.com/en/docs/install).

## Download dependencies:
```shell
yarn
```
## Start for development
```shell
yarn serve
````
## Running
### Chromium/Chrome
```shell script
yarn run-chromium
```
### Firefox
```shell script
yarn run-firefox
```

### Chromium Edge on Windows
```shell
yarn run-edge-windows
```

### Other browsers
1. Open the extensions page in your browser.
1. Enable the developer tools (top-right corner usually).
1. Either drag-drop the `dist` folder onto the browser or click "Load unpacked extension" and choose it.

## Contribution
Feel free to contribute!  
If you want to fork, make sure to credit [avi12](https://avi12.com) and link to [this repository](https://github.com/avi12/youtube-speed-control).