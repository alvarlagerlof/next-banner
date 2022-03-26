import { Browser } from "puppeteer";
import fs from "fs";

import { NextServer, Logs } from "../types";
import { getPath } from "../file";
import getConfig from "../config";
import { Payload } from "../../types";
import { LAYOUT_DIR, OUTPUT_DIR } from "../../constants";

const config = getConfig();

function getOutput(route: string) {
  const outputFolder = `public/${OUTPUT_DIR}`;
  const indexFixedRoute = route === "/" ? "index" : route.replace("/", "");

  const file = `${outputFolder}/${indexFixedRoute}.png`;
  const folder = file.replace(/\/[^/]+$/, "");

  return {
    folder,
    file,
  };
}

async function captureScreenshot(
  browser: Browser,
  server: NextServer,
  logs: Logs,
  route: string,
  payload: Payload
): Promise<void> {
  const page = await browser.newPage();

  await page.setViewport({
    width: config.width,
    height: config.height,
  });

  page
    .on("console", (message) =>
      logs.push({
        route,
        message: `${message.type().toUpperCase()} ${message.text()}`,
      })
    )
    .on("pageerror", ({ message }) => logs.push({ route, message }));

  // Insert extreacted data
  await page.evaluateOnNewDocument(async (payload) => {
    window.NextBanner = payload;

    // Object.defineProperty(window, "NextBanner", {
    //   get() {
    //     return payload;
    //   },
    // });
  }, payload);

  const layoutUrl = `http://localhost:${server.port}/${LAYOUT_DIR}/${payload.layout}`;

  // await page.goto(layoutUrl, {
  //   waitUntil: ["load", "networkidle0"],
  //   timeout: 5000,
  // });

  await page.goto(layoutUrl, {
    waitUntil: "networkidle0",
  });

  // await page.waitForSelector("img");
  // await page.waitForTimeout(1000);

  // await page.evaluate(() => {
  //   window.scrollBy(0, window.innerHeight);
  // });

  // await page.evaluate(async () => {
  //   await document.body.scrollIntoView(false);

  //   await Promise.all(
  //     Array.from(document.getElementsByTagName("img"), (image) => {
  //       if (image.complete) {
  //         return;
  //       }

  //       return new Promise((resolve, reject) => {
  //         image.addEventListener("load", resolve);
  //         image.addEventListener("error", reject);
  //       });
  //     })
  //   );

  //   Array.from(document.getElementsByTagName("img")).forEach((image) => {
  //     console.log("src is", image.src);
  //   });

  //   Array.from(document.getElementsByTagName("h3")).forEach((image) => {
  //     console.log("text is", image.innerHTML);
  //   });
  // });

  // await page.evaluate(async () => {
  //   await Promise.all(
  //     Array.from(document.getElementsByTagName("img"), (image) => {
  //       if (image.complete) {
  //         return;
  //       }

  //       return new Promise((resolve, reject) => {
  //         image.addEventListener("load", resolve);
  //         image.addEventListener("error", reject);
  //       });
  //     })
  //   );
  // });

  // const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  // const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  // await page.setViewport({ width: bodyWidth, height: bodyHeight });

  // await page.waitForTimeout(1000);

  const { file, folder } = getOutput(route);
  fs.mkdirSync(getPath(folder), { recursive: true });

  await page.screenshot({
    type: "jpeg",
    path: getPath(file),
  });

  await page.close();
}

export default captureScreenshot;
