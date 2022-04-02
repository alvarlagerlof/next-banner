import "../styles/globals.css";
import type { AppProps } from "next/app";
import { BannerMeta } from "next-banner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BannerMeta>
      <Component {...pageProps} />
    </BannerMeta>
  );
}

export default MyApp;
