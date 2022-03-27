import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { OUTPUT_DIR } from "../constants";
import getConfig from "next/config";

interface ProviderProps {
  children: React.ReactNode;
}

export default function Provider({ children }: ProviderProps): JSX.Element {
  const { asPath } = useRouter();

  const getUrl = (baseUrl: string, path: string) => {
    return `${baseUrl}/${OUTPUT_DIR}/${
      path == "/" ? "index" : path.replace("/", "")
    }.png`;
  };
  const { publicRuntimeConfig } = getConfig();
  const domain = publicRuntimeConfig.nextBannerOptions.domain;

  return (
    <>
      <Head>
        <meta property="og:image" content={getUrl(domain, asPath)} />
      </Head>

      {children}
    </>
  );
}
