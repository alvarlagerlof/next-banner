import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { OUTPUT_DIR } from "../constants";
// import { BannerConfig } from "../types";
import getConfig from "next/config";

interface ProviderProps {
  // domain: string;
  children: React.ReactNode;
  // width?: number;
  // height?: number;
}

export default function Provider({
  // domain,
  children,
}: // width = 1200,
// height = 630,
ProviderProps): JSX.Element {
  const { asPath } = useRouter();

  const getUrl = (baseUrl: string, path: string) => {
    return `${baseUrl}/${OUTPUT_DIR}/${
      path == "/" ? "index" : path.replace("/", "")
    }.png`;
  };

  // if (typeof window !== "undefined") {
  //   window.NextBannerConfig = {
  //     domain,
  //     width,
  //     height,
  //   };
  // }

  const { publicRuntimeConfig } = getConfig();
  const domain = publicRuntimeConfig.nextBannerOptions.domain;

  return (
    <>
      <Head>
        <meta property="og:image" content={getUrl(domain, asPath)} />
      </Head>

      {/* <ProviderContext.Provider value={{ domain, width, height }}>

      </ProviderContext.Provider> */}

      {children}
    </>
  );
}

// export const ProviderContext = React.createContext<BannerConfig>({
//   domain: "example.com",
//   width: 1200,
//   height: 630,
// });
