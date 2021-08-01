import { useRouter } from "next/router";

import config from "./next-ogimage.config";

import { Meta } from "../type";

function useImage(): string {
  const { pathname } = useRouter();

  if (pathname == "/") return `${config.publicOutputFolder}/index.png`;

  return `${config.publicOutputFolder}/${pathname}.png`;
}

function useMeta(): Meta {
  const { query } = useRouter();

  return {
    title: query.title.toString(),
    description: query.description.toString(),
  };
}

export { useImage, useMeta };
