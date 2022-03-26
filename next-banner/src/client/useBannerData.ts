import { useEffect, useState } from "react";
import { Data } from "../types";

export function useBannerData(): Data {
  const [data, setData] = useState<Data>({ meta: {}, custom: {} });

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.NextBanner !== "undefined"
    ) {
      setData(window.NextBanner.data);
    }
  }, []);

  return data as Data;
}
