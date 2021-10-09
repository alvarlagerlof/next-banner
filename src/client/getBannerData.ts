import { Data } from "../types";

export default function setBannerData<T>(placeholder: T): T | Data {
  if (
    typeof window !== "undefined" &&
    typeof window.NextOpengraphImage !== "undefined"
  ) {
    return window.NextOpengraphImage.data as T | Data;
  }

  return placeholder as T;
}
