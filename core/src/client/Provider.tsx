import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { OUTPUT_DIR } from "../constants";

interface ProviderProps {
  baseUrl: string;
  children: React.ReactNode;
}

export default function Provider({
  baseUrl,
  children,
}: ProviderProps): JSX.Element {
  const { asPath } = useRouter();

  const getUrl = (baseUrl: string, path: string) => {
    return `${baseUrl}/${OUTPUT_DIR}/${
      path == "/" ? "index" : path.replace("/", "")
    }.png`;
  };

  return (
    <>
      <Head>
        <meta property="og:image" content={getUrl(baseUrl, asPath)} />
      </Head>

      {children}
    </>
  );
}