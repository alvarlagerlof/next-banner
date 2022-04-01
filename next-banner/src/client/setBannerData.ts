import { Custom } from "../types";

/**
 * Sets layout and custom data for the banner.
 * @constructor
 * @param {string} layout - Layout file to render
 * @param {Custom} custom - Custom data to pass to layout
 */
export default function setBannerData(layout: string, custom: Custom): void {
  if (typeof window !== "undefined") {
    window.NextBannerData = {
      layout,
      meta: {},
      custom,
    };
  }
}
