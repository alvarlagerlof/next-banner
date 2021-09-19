import Document, { Html, Head, Main, NextScript } from "next/document";
import { useOgImage } from "next-opengraph-image";

export const OgImage = ({ children }) => {
  const ogImage = useOgImage({
    baseUrl: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  });

  return children(ogImage);
};

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.jsdelivr.net/npm/water.css@2/out/light.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
