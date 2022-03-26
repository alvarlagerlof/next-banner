import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { OUTPUT_DIR } from "../constants";

interface ProviderProps {
  baseUrl: string;
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export default function Provider({
  baseUrl,
  children,
  width = 1200,
  height = 630,
}: ProviderProps): JSX.Element {
  const { asPath } = useRouter();

  const getUrl = (baseUrl: string, path: string) => {
    return `${baseUrl}/${OUTPUT_DIR}/${
      path == "/" ? "index" : path.replace("/", "")
    }.png`;
  };

  if (typeof window !== "undefined") {
    window.NextBannerConfig = {
      width,
      height,
    };
  }

  return (
    <>
      <Head>
        <meta property="og:image" content={getUrl(baseUrl, asPath)} />
      </Head>

      <ProviderContext.Provider value={{ width, height }}>
        {children}
      </ProviderContext.Provider>
    </>
  );
}

interface Size {
  width: number;
  height: number;
}

export const ProviderContext = React.createContext<Size>({
  width: 1200,
  height: 630,
});
