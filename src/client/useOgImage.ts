import { useRouter } from "next/router";

import { DATA_NAMES, DEFAULT_LAYOUT, OUTPUT_DIR } from "../constants";
import { JsonMap } from "../types";

export type Tag = {
  property: "og:image";
  content: string;
  [DATA_NAMES.base64]: string;
  [DATA_NAMES.layout]: string;
};

export type Options = {
  layout?: string;
  data?: JsonMap;
  baseUrl?: string;
};

function getUrl(path: string, layout: string, baseUrl?: string) {
  const modifiedPath = path == "/" ? "/index" : path;
  const baseUrlWithDefaults =
    process.env.VERCEL_URL ?? process.env.DEPLOY_PRIME_URL ?? baseUrl ?? "";

  return `${baseUrlWithDefaults}/${OUTPUT_DIR}/${layout}${modifiedPath}.png`;
}

function getBase64(data: JsonMap) {
  const json = JSON.stringify(data);

  if (typeof window !== "undefined") {
    return btoa(json);
  }

  return Buffer.from(json, "utf-8").toString("base64");
}

export default function useOgImage(params: Options): Tag {
  const { asPath } = useRouter();

  const layout = params?.layout ?? DEFAULT_LAYOUT;
  const data = params?.data ?? {};

  return {
    property: "og:image",
    content: getUrl(asPath, layout, params?.baseUrl),
    [DATA_NAMES.base64]: getBase64(data),
    [DATA_NAMES.layout]: layout,
  };
}
