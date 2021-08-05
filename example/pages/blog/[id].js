import Head from "next/head";
import { useOgImage } from "next-opengraph-image";

export default function Post({ title, body }) {
  const ogImage = useOgImage({
    layout: "blogpost",
    data: {
      author: "me",
      image:
        "https://images.unsplash.com/photo-1597840637868-417c13c7e962?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1926&q=80",
    },
  });

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={body.substring(0, 50)} />

        <meta {...ogImage} />
      </Head>

      <h1>{title}</h1>
      <p>{body}</p>
    </div>
  );
}

async function fetchPosts() {
  return (
    await fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
      res.json()
    )
  ).splice(0, 10);
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
