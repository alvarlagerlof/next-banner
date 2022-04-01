declare global {
  interface Window {
    NextBannerData: DataWithLayout;
    NextBannerConfig: BannerConfig;
  }
}

export interface Meta {
  title?: string;
  description?: string;
}

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
