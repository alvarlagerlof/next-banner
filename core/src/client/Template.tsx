import React from "react";
import { ScreenshotCanvas } from ".";
import { useBannerData } from ".";

interface TemplateProps {
  backgroundColor?: string;
  textColor?: string;
}

export default function Template({
  backgroundColor = "#d9ebff",
  textColor = "#000000",
}: TemplateProps): JSX.Element {
  const {
    meta: { title = "Placeholder title", description = "Placeholder description" },
  } = useBannerData();

  return (
    <ScreenshotCanvas
      style={{
        background: backgroundColor,
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
        <img src="/favicon.ico" alt="" style={{ width: "50px", height: "50px" }} />
      </div>

      <p
        style={{
          fontSize: "6em",
          color: textColor,
          fontWeight: 900,
          margin: 0,
        }}
      >
        {title}
      </p>
      <p
        style={{
          fontSize: "3em",
          color: textColor,
          margin: 0,
          fontWeight: 500,
        }}
      >
        {description}
      </p>
    </ScreenshotCanvas>
  );
}
