import { getOgImageData } from "next-opengraph-image";

export default function OgImage() {
  const { title, description, image } = getOgImageData({
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
        position: "fixed",
        top: "0",
        left: "0",
      }}
    >
      <img
        src={image}
        alt=""
        style={{
          width: "100px",
          height: "100px",
        }}
      />

      <div>
        <h1 style={{ fontSize: "5em" }}>{title}</h1>
        <h2 style={{ fontSize: "2em" }}>{description}</h2>
      </div>
    </div>
  );
}
