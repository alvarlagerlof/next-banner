import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import getConfig from "next/config";

interface BannerMetaProps {
  children: React.ReactNode;
}

export default function NextBannerMeta({ children }: BannerMetaProps): JSX.Element {
  const { asPath, locale, basePath, pathname } = useRouter();

  console.log({ basePath, pathname, asPath });

  const {
    publicRuntimeConfig: {
      nextBannerOptions: { domain, outputDir },
    },
  } = getConfig();

  let url = `${domain}/${outputDir}`;

  if (locale) {
    url += `/${locale}`;
  }

  url += asPath;

  // remove #anchors
  url = url.replace(/#[a-zA-Z-]*/, "");

  // add "index" to if on root page
  if (asPath === "/") {
    url.slice(0, -1);
    url += "index";
  }

  url += ".jpg";

  return (
    <>
      <Head>
        <meta property="og:image" content={url} />
      </Head>

      {children}
    </>
  );
}
