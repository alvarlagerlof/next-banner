import { NextConfig } from "next";
import { BannerConfig } from "../types";

import fs from "node:fs";
import { mergeWithDefault, defaultConfig, getConfig } from "../cli/config";
import { getPath } from "../cli/file";
import { CONFIG_FILE } from "../constants";

export default function withBannerOptions(options: Partial<BannerConfig> = {}) {
  try {
    fs.writeFileSync(getPath(CONFIG_FILE), JSON.stringify(options, null, 2));
  } catch (err) {
    console.error(err);
  }

  const bannerConfig: BannerConfig = mergeWithDefault(defaultConfig, getConfig());

  return (nextConfig: NextConfig) => ({
    ...nextConfig,
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextBannerOptions: bannerConfig,
    },
  });
}
