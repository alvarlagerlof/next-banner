/* eslint-disable @next/next/no-img-element */
import { useBannerData, ScreenshotCanvas } from "next-banner";

export default function Banner() {
  const {
    meta: {
      title = "Placeholder title",
      description = "Placeholder description",
    },
    custom: {
      image = "https://placekitten.com/200/200"
    }
  } = useBannerData()


  return (
    <ScreenshotCanvas
      style={{
        background: "#d9ebff",
        padding: 80,
        boxSizing: "border-box",
      }}
    >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "20px",
            marginBlockEnd: "30px",
          }}
        >
          <img
            src={image}
            alt=""
            style={{
              width: "400px",
              height: "400px",
            }}
          />

          <div>
            <h3>{image}</h3>

            <h1 style={{ fontSize: "5em" }}>{title}</h1>
            <h2 style={{ fontSize: "2em" }}>{description}</h2>
          </div>
        </div>
    </ScreenshotCanvas>
  );
}
