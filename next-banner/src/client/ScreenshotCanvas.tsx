import getConfig from "next/config";
import React from "react";

interface ScreenshotCanvasProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

export default function ScreenshotCanvas({
  style,
  className,
  children,
}: ScreenshotCanvasProps): JSX.Element {
  const { publicRuntimeConfig } = getConfig();
  const width = publicRuntimeConfig.nextBannerOptions.width;
  const height = publicRuntimeConfig.nextBannerOptions.height;

  return (
    <div
      className={className}
      style={{
        width,
        height,
        position: "fixed",
        background: "white",
        top: "0",
        left: "0",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
