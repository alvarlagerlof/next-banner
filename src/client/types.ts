export type MetaTag = {
  name: "next-opengraph-image";
  content: string;
};

export type UseImageOptions = {
  layout: string;
};

type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
type JsonArray = Array<AnyJson>;
export interface JsonMap {
  [key: string]: AnyJson;
}

export type Data = {
  meta: {
    title: string;
    description: string;
  };
  custom: JsonMap | null;
};
