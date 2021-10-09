import { Data } from "../types";

export default function setBannerData<T>(placeholder: T): T | Data {
  if (
    typeof window !== "undefined" &&
    typeof window.NextBanner !== "undefined"
  ) {
    return window.NextBanner.data as T | Data;
  }

  return placeholder as T;
}
