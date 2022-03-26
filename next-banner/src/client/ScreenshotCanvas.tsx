import React, { useContext } from "react";
import { ProviderContext } from "./Provider";

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
  const { width, height } = useContext(ProviderContext);

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
          width,
          height,
          ...style,
        }}
      >
        {children}
      </div>
    </div>
  );
}
