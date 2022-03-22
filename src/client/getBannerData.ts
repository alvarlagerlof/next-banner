import { Data } from "../types";

export default function setBannerData<T>(placeholder: T): T | Data {
  sleep(10000);

  if (
    typeof window !== "undefined" &&
    typeof window.NextBanner !== "undefined"
  ) {
    return window.NextBanner.data as T | Data;
  }

  return placeholder as T;
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
