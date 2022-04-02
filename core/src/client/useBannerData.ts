import { useEffect, useState } from "react";
import { Data } from "../types";

export function useBannerData(): Data {
  const [data, setData] = useState<Data>({ meta: {}, custom: {} });

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.NextBannerData !== "undefined") {
      setData({
        meta: window.NextBannerData.meta,
        custom: window.NextBannerData.custom,
      });
    }
  }, []);

  return data as Data;
}
