import { useRouter } from "next/router";

import { OUTPUT_DIR } from "../constants";

export default function useImage({ layout }: UseImageOptions): string {
  const { asPath } = useRouter();

  if (asPath == "/") return `/${OUTPUT_DIR}/index.png`;

  return `/${OUTPUT_DIR}${asPath}.png`;
}
