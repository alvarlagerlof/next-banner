import { merge } from "@corex/deepmerge";

import { BannerConfig } from "../types";
import { loadFile } from "./file";
import { getPath } from "./file";
// import { CONFIG_FILE } from "../constants";

const CONFIG_FILE = "heksan";

const defaultConfig: Partial<BannerConfig> = {
  nextDir: ".next",
  excludePages: [],
  width: 1200,
  height: 630,
};

function getConfig(): BannerConfig {
  return loadConfig(getPath(`./${CONFIG_FILE}`));
}

function loadConfig(path: string): BannerConfig {
  const baseConfig = loadFile<Partial<BannerConfig>>(path);
  return mergeWithDefault(defaultConfig, baseConfig);
}

function mergeWithDefault(
  current: Partial<BannerConfig>,
  next: Partial<BannerConfig> | undefined
): BannerConfig {
  if (next === undefined) {
    return current as BannerConfig;
  }

  return merge([current, next], {
    arrayMergeType: "overwrite",
  }) as BannerConfig;
}

export default getConfig;
