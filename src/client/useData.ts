import { Data } from "./types";
import { WINDOW_VAR } from "../constants";

type Options = {
  placeholder: Data;
};

export default function useData({ placeholder }: Options): Data {
  if (typeof window !== "undefined" && process.env.NODE_ENV == "production") {
    return window[WINDOW_VAR];
  }

  return placeholder;
}
