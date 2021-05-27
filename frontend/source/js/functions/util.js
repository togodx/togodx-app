import Color from "../classes/Color";

/**
 * 
 * @param {Color} baseColor 
 * @param {Color} tintColor 
 */
export function colorTintByHue(baseColor, hue) {
  return baseColor.mix(new Color('hsv', [hue, 70, 50]), .2).set({lightness: lightness => lightness * 1.2}).to('srgb');
}