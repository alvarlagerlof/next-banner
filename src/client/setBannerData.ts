import { Payload } from "../types";

export default function setBannerData(options: Payload): void {
  if (typeof window !== "undefined") {
    window.NextBanner = options;
  }
}
