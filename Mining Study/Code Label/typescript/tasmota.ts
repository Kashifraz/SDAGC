import * as bulbstate from "./bulbstate.js";

// Tasmota's API is fucking dogshit garbage tier:
//
// - The API that we're using (?m=1) is not documented anywhere, and because
//   it's written in C, no one can fucking read the code.
// - We can't use the HSBColor command with CT, because only one command can run
//   at a time, but those commands also override each other so Backlog doesn't
//   work.
// - Color seems to be the only API that allows changing both colors and CT, but
//   it also uses RGB instead of HSB (?) because I DON'T FUCKING KNOW!
// - WHAT THE FUCK EVEN IS HSB?! IS IT HSV OR HSL?! WHAT THE FUCK
// - WHY ARE THE TASMOTA DEVS THIS FUCKING DUMB?!?!?!
// - I FUCKING HATE C PROGRAMS.
// - We're manually converting HSV to RGB for this. Fuck this.
//
// For an RGBCCT light, there are 5 channels:
//
// 1. Red
// 2. Green
// 3. Blue
// 4. CT cold-leaning
// 5. CT warm-leaning
//
// For 4 and 5, the values are divided by the brighness. For example, a value of
// [0, 50] means 50% brightness, 100% warm. A value of [50, 0] means 50%
// brightess, 0% warm.

export function commandFade(): string {
  return `Backlog Fade 1; Speed 1`;
}

export const enableFade = "Fade 1";

export function commandApply(state: bulbstate.State): string {
  const rgb = hsv2rgb(state.h, state.s, state.v);
  const chs = cct2chs(state.w, state.s, state.v);
  const color =
    "#" +
    [
      range2hex(rgb.r),
      range2hex(rgb.g),
      range2hex(rgb.b),
      range2hex(chs[0]),
      range2hex(chs[1]),
    ].join("");
  console.debug(state, color);
  const power = state.on ? "ON" : "OFF";
  return `Backlog Color ${color}; Power ${power}`;
}

// range2hex converts a value in the range [0, 100] to a hex string.
function range2hex(v: number): string {
  v = Math.round((v / 100) * 255);
  const hex = v.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

// cct2chs converts a value of value [0, 100] and white temperature [0, 100] to
// a pair of cold-warm values.
function cct2chs(w: number, s: number, v: number): [number, number] {
  // Function written thanks to ChatGPT :)
  // https://chat.openai.com/share/00e006b8-71f3-43d0-80dc-774c4551f6e3

  v = clamp(v, 0, 100);
  w = clamp(w, 0, 100);
  s = clamp(s, 0, 100);

  // Calculate the saturation factor
  const saturationFactor = 1 - s / 100;

  // Calculate CT cold-leaning and CT warm-leaning values
  const cold = (100 - w) * (v / 100) * saturationFactor;
  const warm = w * (v / 100) * saturationFactor;

  return [cold, warm];
}

// hsv2rgb converts HSV to RGB. H should be [0, 360], S should be [0, 100] and V
// should be [0, 100]. The RGB values are returned as [0, 100].
function hsv2rgb(
  h: number,
  s: number,
  v: number
): { r: number; g: number; b: number } {
  h = clamp(h / 360, 0, 1);
  s = clamp(s / 100, 0, 1);
  v = clamp(v / 100, 0, 1);

  let r: number, g: number, b: number;
  let i = Math.floor(h * 6);
  let f = h * 6 - i;
  let p = v * (1 - s);
  let q = v * (1 - f * s);
  let t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0:
      (r = v), (g = t), (b = p);
      break;
    case 1:
      (r = q), (g = v), (b = p);
      break;
    case 2:
      (r = p), (g = v), (b = t);
      break;
    case 3:
      (r = p), (g = q), (b = v);
      break;
    case 4:
      (r = t), (g = p), (b = v);
      break;
    case 5:
      (r = v), (g = p), (b = q);
      break;
  }

  return {
    r: r! * 100,
    g: g! * 100,
    b: b! * 100,
  };
}

function clamp(v: number, min: number, max: number): number {
  return Math.min(Math.max(v, min), max);
}
