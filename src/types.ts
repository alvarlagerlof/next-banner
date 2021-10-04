declare global {
  interface Window {
    NextOpengraphImage: Payload;
  }
}

export interface Payload {
  data: Record<string, unknown>;
  layout: string;
}
