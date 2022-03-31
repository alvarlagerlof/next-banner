import { useEffect, useState } from "react";
import { Data } from "../types";

export function useBannerData(): Data {
  const [data, setData] = useState<Data>({ meta: {}, custom: {} });

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.NextBannerPayload !== "undefined") {
      setData({
        meta: window.NextBannerPayload.meta,
        custom: window.NextBannerPayload.custom,
      });
    }
  }, []);

  return data as Data;
}
