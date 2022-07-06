import { useEffect, useState } from "react";
import { Data } from "../types";

export default function useBannerData(): Data {
  const [data, setData] = useState<Data>({ meta: {}, custom: {} });

  useEffect(() => {
    if (typeof globalThis !== "undefined" && typeof globalThis.NextBannerData !== "undefined") {
      setData({
        meta: globalThis.NextBannerData.meta,
        custom: globalThis.NextBannerData.custom,
      });
    }
  }, []);

  return data as Data;
}
