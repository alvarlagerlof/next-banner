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
