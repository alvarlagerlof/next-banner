import Link from "next/link";
import Head from "next/head";
import { useImageUrl } from "next-opengraph-image";

export default function Blog({ posts }) {
  const image = useImageUrl({
    layout: "blog",
    data: {
      title: "Blog",
      description: "This is the blog page",
      author: "Alvar Lagerlöf",
    },
  });

  return (
    <div>
      <Head>
        <title>Blog</title>
        <meta name="description" content="This is the blog page" />
        <meta name="og:image" content={image} />
      </Head>

      <h1>Posts</h1>

      <ul>
        {posts.map((post) => {
          return (
            <li key={post.id}>
              <Link href={`/blog/${post.id}`} passHref>
                <a>{post.title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

async function fetchPosts() {
  return await fetch("https://jsonplaceholder.typicode.com/posts").then((res) =>
    res.json()
  );
}

export async function getStaticProps() {
  const posts = await fetchPosts();

  return {
    props: {
      posts,
    },
  };
}
