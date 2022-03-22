import React from "react";
import { ScreenshotCanvas } from ".";
import { getBannerData } from ".";

interface TemplateProps {
  siteName?: string;
  backgroundColor?: string;
  textColor?: string;
}

export default function Template({
  siteName = "Placeholder site name",
  backgroundColor = "#d9ebff",
  textColor = "#000000",
}: TemplateProps): JSX.Element {
  const { title, description } = getBannerData({
    title: "Placeholder title",
    description: "Placeholder description",
  });


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
        <img
          src="/favicon.ico"
          alt=""
          style={{ width: "50px", height: "50px" }}
        />
        <p
          style={{
            fontSize: "2.4em",
            fontWeight: 700,
            color: textColor,
            margin: 0,
          }}
        >
          {siteName}
        </p>
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
