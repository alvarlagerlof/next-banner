type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
type JsonArray = Array<AnyJson>;
export interface JsonMap {
  [key: string]: AnyJson;
}

export type Data = JsonMap;
