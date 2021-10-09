import Link from "next/link";
import { Provider } from "next-banner";

import "../styles.css";

function MyApp({ Component, pageProps }) {
  return (
    <Provider baseUrl={`https://${process.env.NEXT_PUBLIC_VERCEL_URL}`}>
      <Nav />
      <Component {...pageProps} />
    </Provider>
  );
}

function Nav() {
  return (
    <nav
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link href="/" passHref>
        <a>next-banner</a>
      </Link>
      <ul
        style={{
          display: "flex",
          flexDirection: "row",
          listStyle: "none",
          gap: "16px",
        }}
      >
        <li>
          <Link href="/" passHref>
            <a>Start</a>
          </Link>
        </li>
        <li>
          <Link href="/about" passHref>
            <a>About</a>
          </Link>
        </li>
        <li>
          <Link href="/blog" passHref>
            <a>Blog</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default MyApp;
