declare global {
  interface Window {
    NextBanner: Payload;
  }
}

export interface Meta {
  title?: string;
  description?: string;
}

export type Data = {
  meta: Meta;
  custom?: any;
};

// Record<string, unknown>

export interface Payload {
  data: Data;
  layout: string;
}

export interface BannerConfig {
  nextDir: string;
  outputDir: string;
  excludePages: string[];
  width: number;
  height: number;
}
