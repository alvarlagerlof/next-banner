import Head from "next/head";

export default function About() {
  return (
    <div>
      <Head>
        <title>About</title>
        <meta
          name="description"
          content="Quis incididunt ut voluptate anim exercitation cupidatat amet Lorem deserunt laboris excepteur reprehenderit pariatur et."
        />
      </Head>

      <main>
        <h1>About me</h1>

        <p>
          Mollit fugiat eiusmod consectetur officia fugiat culpa aute Lorem sit.
          Adipisicing Lorem adipisicing dolore est ad proident esse. Aute Lorem
          cillum nulla eu laborum duis officia. Excepteur ea dolore amet minim.
        </p>
        <p>
          Dolore irure consectetur in tempor ea est in ea tempor aliquip. Et
          elit mollit nulla voluptate deserunt velit mollit exercitation. Velit
          duis qui tempor magna nisi quis. Veniam reprehenderit ipsum
          consectetur velit laborum. Laboris proident esse qui anim esse sint
          nostrud anim eiusmod. Incididunt do adipisicing eu duis consequat
          pariatur occaecat. Amet officia laboris culpa qui aliquip occaecat
          ullamco officia laborum labore.
        </p>

        <img src="https://placekitten.com/408/282" alt="Me" />
      </main>
    </div>
  );
}
