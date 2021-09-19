import Head from "next/head";
import { useOgImage } from "next-opengraph-image";

export default function Home() {
  const ogImage = useOgImage({
    baseUrl: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
  });

  return (
    <div>
      <Head>
        <title>Welcome</title>
        <meta
          name="description"
          content="Sunt excepteur elit aliquip mollit irure minim velit. Laboris commodo
          exercitation."
        />
        <link rel="icon" href="/favicon.ico" />

        <meta {...ogImage} />
      </Head>

      <main>
        <h1>Welcome</h1>

        <p>
          Sunt excepteur elit aliquip mollit irure minim velit. Laboris commodo
          exercitation. Lorem voluptate ad ullamco dolor cillum officia sint
          proident laboris nostrud. Commodo et nostrud elit tempor. Consectetur
          et incididunt nisi consequat culpa anim ut cupidatat. Eu occaecat ex
          aliquip consectetur consequat.
        </p>
        <p>
          Ut elit eu laboris magna. Ex eiusmod qui magna exercitation elit elit
          proident veniam. Occaecat Lorem voluptate irure proident laborum
          nostrud laboris. Dolore aute aliqua ullamco voluptate Lorem velit
          minim veniam enim enim amet minim. Irure dolor aliqua esse est
          reprehenderit culpa aute laborum labore sint sunt.
        </p>
      </main>
    </div>
  );
}
