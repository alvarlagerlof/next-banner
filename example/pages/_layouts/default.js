import { useUrlData } from "next-opengraph-image";

export default function OgImage() {
  const { meta, custom } = useUrlData();

  return (
    <div
      style={{
        padding: "100px",
        background: "#ededed",
        width: "1200px",
        height: "600px",
      }}
    >
      {custom.image ? (
        <img src={custom.image} height="100px" alt="" />
      ) : (
        <img src="/vercel.svg" alt="" style={{ marginBottom: "70px" }} />
      )}

      <div>
        <h1 style={{ fontSize: "5em" }}>{meta.title}</h1>
        <h2 style={{ fontSize: "2em" }}>{meta.description}</h2>
      </div>
    </div>
  );
}
