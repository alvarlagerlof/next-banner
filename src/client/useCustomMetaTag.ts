import { JsonMap } from "../types";

export default function useCustomMetaTag(data: JsonMap): MetaTag {
  const json = JSON.stringify(data);
  const base64 = btoa(json);

  return { name: "next-opengraph-image", content: base64 };
}
