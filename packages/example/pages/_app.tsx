import "../styles/globals.css";
import type { AppProps } from "next/app";
import { NextBannerMeta } from "next-banner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextBannerMeta>
      <Component {...pageProps} />
    </NextBannerMeta>
  );
}

export default MyApp;
