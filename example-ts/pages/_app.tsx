import "../styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "next-banner";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Provider baseUrl="example.com">
      <Component {...pageProps} />
    </Provider>
  );
}
export default MyApp;
