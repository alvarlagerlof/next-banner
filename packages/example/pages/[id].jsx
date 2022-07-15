/* eslint-disable @next/next/no-img-element */
import Head from "next/head";
import { setBannerData } from "next-banner";

export default function Post({ title, body, image }) {
  setBannerData({
    layout: "post",
    custom: {
      image,
    },
  });

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name="description" content={body.substring(0, 50)} />
      </Head>

      <h1>{title}</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <em>Written by</em>

        <img
          src={image}
          alt="Author"
          style={{
            objectFit: "cover",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
          }}
        />
      </div>

      <p>{body}</p>
    </div>
  );
}

async function fetchPosts() {
  return (
    await fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
      res.json()
    )
  )
    .filter((_, index) => {
      return index < 5;
    })
    .map((item, index) => {
      return { ...item, image: `https://placem.at/people?w=${400 + index}` };
    });
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
