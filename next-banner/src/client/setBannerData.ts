import { Data } from "../types";

/**
 * Sets layout and custom data for the banner.
 * @constructor
 * @param {string} layout - Layout file to render
 * @param {string} custom - Custom data to pass to layout
 */
export default function setBannerData(
  layout: string,
  custom: Record<string, unknown>
): void {
  if (typeof window !== "undefined") {
    window.NextBanner = {
      layout,
      data: <Data>{
        meta: {},
        custom,
      },
    };
  }
}
