import Head from "next/head";

import { useImage } from "next-opengraph-image";

export default function Post({ title, body }) {
  const image = useImage();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={body.substring(0, 50)} />
        <meta property="og:image" content={image}></meta>
      </Head>

      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}

async function fetchPosts() {
  return await fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
    res.json()
  );
}

export async function getStaticProps({ params }) {
  const posts = await fetchPosts();

  const post = posts.find((post) => post.id.toString() === params.id);

  return {
    props: {
      ...post,
    },
  };
}

export async function getStaticPaths() {
  const posts = await fetchPosts();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}
