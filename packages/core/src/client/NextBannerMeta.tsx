import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import getConfig from "next/config";

interface BannerMetaProps {
  children: React.ReactNode;
}

export default function NextBannerMeta({ children }: BannerMetaProps): JSX.Element {
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
        <meta name="twitter:card" content="summary_large_image"></meta>
      </Head>

      {children}
    </>
  );
}
