import { useData } from "next-opengraph-image";

export default function OgImage() {
  const { title, description, image } = useData({
    placeholder: {
      title: "Placeholder title",
      description: "Placeholder description",
      image: "https://placekitten.com/200/200",
    },
  });

  return (
    <div
      style={{
        padding: "100px",
        background: "#ededed",
        width: "1200px",
        height: "630px",
      }}
    >
      <img src={image} height="100px" alt="" />

      <div>
        <h1 style={{ fontSize: "5em" }}>{title}</h1>
        <h2 style={{ fontSize: "2em" }}>{description}</h2>
      </div>
    </div>
  );
}
