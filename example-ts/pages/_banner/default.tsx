import { NextPage } from "next";
import { getBannerData, ScreenshotCanvas } from "next-banner";

const Banner: NextPage = () => {
  const { title, description } = getBannerData({
    title: "Placeholder title",
    description: "Placeholder description",
  });

  return (
    <ScreenshotCanvas>
      <h1>{title}</h1>
      <h2>{description}</h2>
    </ScreenshotCanvas>
  );
};

export default Banner;
