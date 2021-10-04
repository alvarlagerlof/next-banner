import { Payload } from "../types";

export default function setOgImageData(options: Payload): void {
  if (typeof window !== "undefined") {
    window.NextOpengraphImage = options;
  }
}
