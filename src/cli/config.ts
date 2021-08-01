import { merge } from "@corex/deepmerge";

import { IConfig } from "../interfaces";
import { loadFile } from "./file";
import { getPath } from "./file";

const defaultConfig: Partial<IConfig> = {
  sourceDir: ".next",
  excludePages: [],
  width: 1200,
  height: 600,
};

function getConfig(): IConfig {
  return loadConfig(getPath("./next-opengraph-image.json"));
}

function loadConfig(path: string): IConfig {
  const baseConfig = loadFile<Partial<IConfig>>(path);
  return mergeWithDefault(defaultConfig, baseConfig);
}

function mergeWithDefault(
  current: Partial<IConfig>,
  next: Partial<IConfig> | undefined
): IConfig {
  if (next === undefined) {
    return current as IConfig;
  }

  return merge([current, next], {
    arrayMergeType: "overwrite",
  }) as IConfig;
}

export default getConfig;
