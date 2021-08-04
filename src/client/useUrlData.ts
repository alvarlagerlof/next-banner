import { useRouter } from "next/router";

import { Data } from "./types";

export default function useData(): Data {
  const { query } = useRouter();

  if (typeof window !== "undefined" && query.meta && query.custom) {
    const meta = JSON.parse(atob(query?.meta?.toString() ?? btoa("{}")));
    const custom = JSON.parse(atob(query?.custom?.toString() ?? btoa("{}")));

    return {
      meta,
      custom,
    };
  }

  return {
    meta: {
      title: "Window is not defined",
      description: "Window is not defined",
    },
    custom: {},
  };
}
