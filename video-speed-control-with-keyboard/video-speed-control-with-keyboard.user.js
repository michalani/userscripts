// ==UserScript==

// @name                Video Speed Control with Keyboard
// @description         Control any HTML5 video playback speed by pressing shortcut keys. See source code comment for the shortcut keymap.
// @version             3.0
// @license             MIT

// @supportURL          https://github.com/ni554n/userscripts/issues

// @namespace           io.github.ni554n
// @include             *

// @author              Nissan Ahmed
// @homepageURL         https://ni554n.github.io/
// @contributionURL     https://paypal.me/ni554n

// ==/UserScript==

/* Keymap:
 * ┌─────┬───────┐
 * │ Key │ Speed │
 * ├─────┼───────┤
 * │  ,  │ -0.5x │
 * ├─────┼───────┤
 * │  .  │ +0.5x │
 * ├─────┼───────┤
 * │  ;  │   1x  │
 * ├─────┼───────┤
 * │  '  │  2.5x │
 * ├─────┼───────┤
 * │  [  │   2x  │
 * ├─────┼───────┤
 * │  ]  │ 1.75x │
 * └─────┴───────┘
 */

// Stores currently playing video element reference for changing the speed later.
let video;

// Stores currently selected speed. Also acts as default / initial playing speed.
let speed = 1;

/* The "playing" event always fires automatically at the start of a video but "play" event is not.
 * After using the event for the initial key registration, "play" event is used for capturing the active video reference.
 */
document.addEventListener("playing", registerShortcutKeys, { capture: true, once: true });
document.addEventListener("playing", restoreSpeed, { capture: true });
document.addEventListener("play", captureActiveVideoElement, true);

function registerShortcutKeys(event) {
  captureActiveVideoElement(event);

  document.addEventListener("keydown", handlePressedKey);
}

function restoreSpeed(event) {
  if (event.target.playbackRate !== speed) event.target.playbackRate = speed;
}

function captureActiveVideoElement(event) {
  video = event.target;
}

function handlePressedKey(event) {
  // If the pressed key is coming from any input field, do nothing.
  const target = event.target;
  if (target.localName === "input" || target.localName === "textarea" || target.isContentEditable) return;

  // Mapping keys with actions.
  const key = event.key;
  if (key === ",") video.playbackRate -= 0.5;
  else if (key === ".") video.playbackRate += 0.5;
  else if (key === ";") video.playbackRate = 1;
  else if (key === "\'") video.playbackRate = 2.5;
  else if (key === "[") video.playbackRate = 2;
  else if (key === "]") video.playbackRate = 1.75;

  // Saving the speed for next resume or video playback.
  speed = video.playbackRate;
}
