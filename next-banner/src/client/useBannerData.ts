import { useEffect, useState } from "react";
import { Data } from "../types";

export function useBannerData(): Data {
  const [data, setData] = useState<Data>({ meta: {}, custom: {} });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.NextBannerPayload !== "undefined"
    ) {
      setData(window.NextBannerPayload);
    }
  }, []);

  return data as Data;
}
