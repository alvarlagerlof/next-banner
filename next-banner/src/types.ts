declare global {
  interface Window {
    NextBannerPayload: Payload;
    NextBannerConfig: NextBannerConfig;
  }
}

interface NextBannerConfig {
  width: number;
  height: number;
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
  excludePages: string[];
  width: number;
  height: number;
}
