declare global {
  interface globalThis {
    NextBannerData: DataWithLayout;
    NextBannerConfig: BannerConfig;
  }
}

export interface Meta {
  title?: string;
  description?: string;
}

/* This is the data object that is being passed from React
into Puppeteer and then into the window.NextBannerData to be
read by the layout files being screenshoted

Any is the right type because we do not have any idea what the type is */

/* eslint-disable-next-line */
export type Custom = Record<string, any>;

export interface Data {
  meta: Meta;
  custom: Custom;
}

export type DataWithLayout = Data & { layout: string };

export interface BannerConfig {
  domain: string;
  excludePages: [];
  nextDir: string;
  layoutDir: string;
  outputDir: string;
  width: number;
  height: number;
  concurrency: number;
}
