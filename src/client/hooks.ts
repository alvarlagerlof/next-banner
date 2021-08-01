import { useRouter } from "next/router";

import { OUTPUT_DIR } from "../constants";
import { Meta } from "../types";

function useImage(): string {
  const { pathname } = useRouter();

  if (pathname == "/") return `${OUTPUT_DIR}/index.png`;

  return `${OUTPUT_DIR}/${pathname}.png`;
}

function useMeta(): Meta {
  const { query } = useRouter();

  return {
    title: query?.title?.toString() ?? "Failed to load title",
    description: query?.description?.toString() ?? "Failed to load description",
  };
}

export { useImage, useMeta };
