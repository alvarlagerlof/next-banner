declare global {
  interface Window {
    NextOpengraphImage: Payload;
  }
}

export interface Meta {
  title?: string;
  description?: string;
}

export type Data = Meta & Record<string, unknown>;

export interface Payload {
  data: Data;
  layout: string;
}
