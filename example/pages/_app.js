import Link from "next/link";
import Head from "next/head";
import { useOgImage } from "next-opengraph-image";

function MyApp({ Component, pageProps }) {
  return (
    <div>
      <Nav />
      <Component {...pageProps} />
    </div>
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
        <a>next-opengraph-image</a>
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
