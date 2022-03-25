import { useEffect, useState } from "react";
import { Data } from "../types";

// export default function getBannerData(): Data {
//   if (
//     typeof window !== "undefined" &&
//     typeof window.NextBanner !== "undefined"
//   ) {
//     return window.NextBanner.data as Data;
//   }

//   return {} as Data;
// }

export default function useBannerData(): Data {
  const [data, setData] = useState<Data>({});

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
