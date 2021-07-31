import { useRouter } from "next/router";

import config from "./next-ogimage.config";

type Meta = {
  title: string;
  description: string;
};

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
