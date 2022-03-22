declare global {
  interface Window {
    NextBanner: Payload;
  }
}

export interface Meta {
  title?: string;
  description?: string;
}

interface Custom {
  custom?: Record<string, unknown>;
}

export type Data = Meta & Custom;

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
