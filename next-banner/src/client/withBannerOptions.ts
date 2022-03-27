import { NextConfig } from "next";
import { BannerConfig } from "../types";

import fs from "node:fs";
import getConfig from "../cli/config";

export default function withBannerOptions(options: Partial<BannerConfig> = {}) {
  let bannerConfig: BannerConfig;

  try {
    fs.writeFileSync(
      "./.next/next-banner.json",
      JSON.stringify(options, null, 2)
    );

    bannerConfig = getConfig();
  } catch (err) {
    console.error(err);
  }

  return (nextConfig: NextConfig) => ({
    ...nextConfig,
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextBannerOptions: bannerConfig,
    },
  });
}
