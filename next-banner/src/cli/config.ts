import { merge } from "merge-anything";

import { BannerConfig } from "../types";
import { loadFile } from "./file";
import { getPath } from "./file";
import { CONFIG_FILE } from "../constants";

const defaultConfig: Partial<BannerConfig> = {
  domain: "example.com",
  excludePages: [],
  width: 1200,
  height: 630,
  concurrency: 5,
};

function getConfig(): BannerConfig {
  const config = loadFile<Partial<BannerConfig>>(getPath(`./${CONFIG_FILE}`));
  return mergeWithDefault(defaultConfig, config);
}

function mergeWithDefault(
  current: Partial<BannerConfig>,
  next: Partial<BannerConfig> | undefined
): BannerConfig {
  if (next === undefined) {
    return current as BannerConfig;
  }

  return merge(current, next) as BannerConfig;
}

export default getConfig;
