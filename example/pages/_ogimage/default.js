import { useData } from "next-opengraph-image";

export default function Default() {
  const { title, description } = useData({
    placeholder: {
      title: "Placeholder title",
      description: "Placeholder description",
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
      <img src="/vercel.svg" alt="" style={{ marginBottom: "70px" }} />

      <div>
        <h1 style={{ fontSize: "5em" }}>{title}</h1>
        <h2 style={{ fontSize: "2em" }}>{description}</h2>
      </div>
    </div>
  );
}
