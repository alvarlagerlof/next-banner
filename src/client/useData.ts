import { WINDOW_VAR } from "../constants";
import { JsonMap } from "../types";

type Options = {
  placeholder: JsonMap;
};

export default function useData({ placeholder }: Options): JsonMap {
  if (typeof window !== "undefined" && process.env.NODE_ENV == "production") {
    return window[WINDOW_VAR];
  }

  return placeholder;
}
