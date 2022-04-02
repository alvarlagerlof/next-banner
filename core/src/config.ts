import { merge } from "merge-anything";
import fs from "node:fs";
import { BannerConfig } from "./types";
import { loadFile } from "./cli/file";
import { getPath } from "./cli/file";
import { NextConfig } from "next/types";

const defaultConfig: BannerConfig = {
  domain: "localhost:3000",
  nextDir: ".next",
  excludePages: [],
  layoutDir: "next-banner-layouts",
  outputDir: "next-banner-generated",
  width: 1200,
  height: 630,
  concurrency: 10,
};

const CONFIG_FILE = "node_modules/.next-banner.json";

async function getConfig(): Promise<BannerConfig> {
  return (await loadFile<BannerConfig>(getPath(`./${CONFIG_FILE}`))) as BannerConfig;
}

type CombinedConfig = { nextBanner: Partial<BannerConfig> } & NextConfig;

/**
 * Sets layout and custom data for the banner.
 * @constructor
 * @param {CombinedConfig} config - Next.js and Banner configuration
 */

function withNextBanner(config: CombinedConfig) {
  // Write config to file to be able to use it in the cli
  const merged = merge(defaultConfig, config.nextBanner);

  return {
    ...config,
    webpack: (webpackConfig) => {
      try {
        const file = getPath(CONFIG_FILE);
        const json = JSON.stringify(merged, null, 2);

        fs.writeFileSync(file, json);
      } catch (err) {
        console.error(err);
      }

      return webpackConfig;
    },
    publicRuntimeConfig: {
      ...config.publicRuntimeConfig,
      nextBannerOptions: merged,
    },
  };
}

export { getConfig, withNextBanner };
