import { useRouter } from "next/router";

import { OUTPUT_DIR } from "../constants";
import { Meta } from "../types";

function useImage(): string {
  const { asPath } = useRouter();

  if (asPath == "/") return `/${OUTPUT_DIR}/index.png`;

  return `/${OUTPUT_DIR}${asPath}.png`;
}

function useMeta(): Meta {
  const { query } = useRouter();

  return {
    title: query?.title?.toString() ?? "Failed to load title",
    description: query?.description?.toString() ?? "Failed to load description",
  };
}

export { useImage, useMeta };
