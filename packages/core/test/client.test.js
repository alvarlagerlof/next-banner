/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import setBannerData from "../src/client/setBannerData";
import useBannerData from "../src/client/useBannerData";
import ScreenshotCanvas from "../src/client/ScreenshotCanvas";

test("should set the layout", async () => {
  setBannerData({ layout: "post" });

  expect(globalThis.NextBannerData.layout).toEqual("post");
});

test("it should set the custom data", async () => {
  setBannerData({
    custom: {
      foo: "bar",
    },
  });

  expect(globalThis.NextBannerData.custom).toEqual({
    foo: "bar",
  });
});

function BannerLayout() {
  const {
    meta: { title = "Placeholder title", description = "Placeholder description" },
    custom: { image = "https://placekitten.com/200/200" },
  } = useBannerData();

  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
      <img src={image} />
    </div>
  );
}

test("it should read globalThis data", async () => {
  setBannerData({
    custom: {
      image: "https://example.com/image.jpg",
    },
  });

  globalThis.NextBannerData = {
    meta: {
      title: "foo",
      description: "bar",
    },
    custom: {
      image: "https://example.com/image.jpg",
    },
  };

  const { getByText, getByRole } = render(<BannerLayout />);

  expect(getByText("foo")).toBeInTheDocument();
  expect(getByText("bar")).toBeInTheDocument();
  expect(getByRole("img")).toHaveAttribute("src", "https://example.com/image.jpg");
});

// jest.mock("next/config", () => ({
//   ...jest.requireActual("next"),
//   getConfig: jest.fn().mockReturnValue({
//     publicRuntimeConfig: {
//       nextBannerOptions: {
//         width: 1000,
//         height: 400,
//       },
//     },
//   }),
// }));

// it("renders ScreenshotLayout at the right size", async () => {
//   const { getByTestId } = render(<ScreenshotCanvas />);

//   expect(getByTestId("next-banner-screenshot-canvas")).toHaveAttribute("width", "1000");
//   expect(getByTestId("next-banner-screenshot-canvas")).toHaveAttribute("height", "400");
// });
