import Link from "next/link";
import Head from "next/head";
import { useOgImage } from "next-opengraph-image";

export default function Blog({ posts }) {
  const ogImage = useOgImage({});

  return (
    <div>
      <Head>
        <title>Blog</title>
        <meta name="description" content="This is the blog page" />

        <meta {...ogImage} />
      </Head>

      <h1>Posts</h1>

      <p>
        Proident incididunt amet irure non duis veniam exercitation nostrud do
        laboris. Ad veniam tempor pariatur amet occaecat pariatur duis sint do
        exercitation ad. Cillum occaecat mollit est irure commodo quis nisi
        minim sit irure nisi.
      </p>

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
