import { DEFAULT_LAYOUT } from "../constants";
import { Custom } from "../types";

interface BannerProps {
  layout?: string;
  custom?: Custom;
}

export default function setBannerData({ layout, custom }: BannerProps): void {
  if (typeof globalThis !== "undefined") {
    globalThis.NextBannerData = {
      layout: layout ?? DEFAULT_LAYOUT,
      meta: {},
      custom: custom ?? {},
    };
  }
}
