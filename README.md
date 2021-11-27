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

## Download dependencies:

```shell
pnpm i
```

## Start for development

```shell
pnpm serve
```

## Running

### Chromium/Chrome

```shell script
pnpm run-chromium
```

### Firefox

```shell script
pnpm run-firefox
```

### Chromium Edge on Windows

```shell
pnpm run-edge-windows
```

### Other browsers

1. Open the extensions page in your browser.
1. Enable the developer mode (top-right corner usually).
1. Either drag-drop the `dist` folder onto the browser or click "Load unpacked extension" and choose it.

## Build & pack

```shell
pnpm build-pack
```

### Build for Firefox (you need to first run `pnpm build-pack`)

```shell
pnpm build-for --browser=firefox
```

### Build for Opera (you need to first run `pnpm build-pack`)

```shell
pnpm build-for --browser=opera
```

## Contribution

Feel free to contribute!  
If you want to fork, make sure to credit [avi12](https://avi12.com) and link
to [this repository](https://github.com/avi12/youtube-speed-control).
