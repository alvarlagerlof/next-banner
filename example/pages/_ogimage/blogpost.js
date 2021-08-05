import { useData } from "next-opengraph-image";

export default function OgImage() {
  const { title, description, author, image } = useData({
    placeholder: {
      title: "Placeholder title",
      description: "Placeholder description",
      author: "me",
      image:
        "https://images.unsplash.com/photo-1597840637868-417c13c7e962?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1926&q=80",
    },
  });

  return (
    <div
      style={{
        padding: "100px",
        background: "#ededed",
        width: "1200px",
        height: "600px",
      }}
    >
      <img src={image} height="100px" alt="" />

      <div>
        <h1 style={{ fontSize: "5em" }}>
          {author} - {title}
        </h1>
        <h2 style={{ fontSize: "2em" }}>{description}</h2>
      </div>
    </div>
  );
}
