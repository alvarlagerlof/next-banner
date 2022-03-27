import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "next-banner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    // <Provider domain="example.com" width={1200} height={630}>
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
