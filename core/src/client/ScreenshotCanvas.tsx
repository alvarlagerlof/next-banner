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
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        background: "white",
        top: "0",
        left: "0",
      }}
    >
      <div
        className={className}
        style={{
          width: "1200px",
          height: "630px",
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
