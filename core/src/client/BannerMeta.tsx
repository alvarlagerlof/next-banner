import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import getConfig from "next/config";

interface BannerMetaProps {
  children: React.ReactNode;
}

export default function BannerMeta({ children }: BannerMetaProps): JSX.Element {
  const { asPath } = useRouter();

  const {
    publicRuntimeConfig: {
      nextBannerOptions: { domain, outputDir },
    },
  } = getConfig();

  // Replace "/" with "index"
  const url = `${domain}/${outputDir}/${asPath == "/" ? "index" : asPath.replace("/", "")}.jpg`;

  return (
    <>
      <Head>
        <meta property="og:image" content={url} />
      </Head>

      {children}
    </>
  );
}
