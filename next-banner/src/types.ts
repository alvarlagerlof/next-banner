declare global {
  interface Window {
    NextBannerPayload: DataWithLayout;
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
  width: number;
  height: number;
  concurrency: number;
}
