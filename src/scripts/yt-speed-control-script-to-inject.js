let gPlayer;

// A function that YouTube expects, which
// if is present - will called by YouTube when
// the player is ready, with the player
// instance being in the parameter
function onYouTubePlayerReady(player) {
  gPlayer = player;

  // https://developers.google.com/youtube/iframe_api_reference#Playback_rate
  player.setPlaybackRate(getSpeed());
}

// The "data-yt-speed-control" attribute on the HTML
// is the speed that the user is preferring
const observerHtml = new MutationObserver(() => {
  gPlayer.setPlaybackRate(getSpeed());
});
observerHtml.observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-yt-speed-control"]
});

function getSpeed() {
  return Number(document.documentElement.dataset.ytSpeedControl);
}