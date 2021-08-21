import { merge } from "@corex/deepmerge";

import { Config } from "./interfaces";
import { loadFile } from "./file";
import { getPath } from "./file";

const defaultConfig: Partial<Config> = {
  sourceDir: ".next",
  excludePages: [],
  width: 1200,
  height: 630,
};

function getConfig(): Config {
  return loadConfig(getPath("./next-opengraph-image.json"));
}

function loadConfig(path: string): Config {
  const baseConfig = loadFile<Partial<Config>>(path);
  return mergeWithDefault(defaultConfig, baseConfig);
}

function mergeWithDefault(
  current: Partial<Config>,
  next: Partial<Config> | undefined
): Config {
  if (next === undefined) {
    return current as Config;
  }

  return merge([current, next], {
    arrayMergeType: "overwrite",
  }) as Config;
}

export default getConfig;