# YouTube Speed Control

A browser extension that lets you control the speed of YouTube videos, even if they're embedded, including changing the
speed "on the fly", i.e. changing the speed will immediately affect any videos you're watching.

![Google Chrome screenshot](https://user-images.githubusercontent.com/6422804/143684962-1c7adbff-d3a5-420a-9eb7-202160592ed9.png)

Available for:

- [Google Chrome](https://chrome.google.com/webstore/detail/dmpbgbehgckaijcpmodinibhkdgbifif) ![users count](https://img.shields.io/chrome-web-store/users/dmpbgbehgckaijcpmodinibhkdgbifif?color=white&label=users&style=flat-square)
- [Mozilla Firefox](https://addons.mozilla.org/addon/youtube-speed-control-1) ![users count](https://img.shields.io/amo/users/youtube-speed-control-1?color=white&label=users&style=flat-square)
- [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/ipajmlopcjnobogfakhlggainepilahm) ![users count](https://img.shields.io/badge/dynamic/json?label=users&query=activeInstallCount&style=flat-square&color=white&url=https://microsoftedge.microsoft.com/addons/getproductdetailsbycrxid/ipajmlopcjnobogfakhlggainepilahm)
- [Opera](https://addons.opera.com/en/extensions/details/youtube-speed-control)

Made by [avi12](https://avi12.com).

### Made with

- [Svelte](https://svelte.dev)
- [Svelte Materialify](https://svelte-materialify.vercel.app/)

## Requirements for setting up

Install [Node.js](https://nodejs.org) and [PNPM](https://pnpm.js.org/installation).

## Install dependencies

```shell script
pnpm i
```

## Start Rollup for development

```shell script
pnpm dev
```

## Running

### Chromium/Chrome

```shell script
pnpm run-chromium
```

### Edge on Windows 10/11

```shell
pnpm run-edge-windows
```

### Browsers that don't support Manifest v3

1. Build the extension for Firefox/Opera (see below).
2. Open the extensions page in that browser.
3. Enable the developer mode (top-right corner usually).
4. Either drag-drop the browser-compatible ZIP onto the browser or click "Load unpacked extension" and choose it.

## Build & pack

```shell
pnpm build-pack
```

### Build for Firefox (first run `pnpm build-pack`)

```shell
pnpm build-for-firefox
```

### Build for Opera (first run `pnpm build-pack`)

```shell
pnpm build-for-opera
```

## Contribution

Feel free to contribute! Make sure to comply with the license, [GPL v3](https://github.com/avi12/skillshare-player-control/blob/main/LICENSE).
