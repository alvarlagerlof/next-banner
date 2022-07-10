import React from "react";
import Head from "next/dist/shared/lib/head.js";
import { useRouter } from "next/dist/client/router.js";
import getConfig from "next/dist/build/babel/loader/get-config.js";

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
