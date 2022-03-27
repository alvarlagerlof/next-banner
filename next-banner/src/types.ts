declare global {
  interface Window {
    NextBannerPayload: Payload;
    NextBannerConfig: BannerConfig;
  }
}

export interface Meta {
  title?: string;
  description?: string;
}

export type Custom = any;

export type Data = {
  meta: Meta;
  custom?: Custom;
};

// Record<string, unknown>

export interface Payload {
  meta: Meta;
  custom?: Custom;
  layout: string;
}

export interface BannerConfig {
  domain: string;
  excludePages: [];
  width: number;
  height: number;
}
