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

async function capturePage(
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
    window.NextOpengraphImage = payload;
    await new Promise((r) => setTimeout(r, 10000));
  }, payload);

  const layoutUrl = `http://localhost:${server.port}/${LAYOUT_DIR}/${payload.layout}`;

  await page.goto(layoutUrl, {
    waitUntil: "networkidle0",
  });

  await page.evaluate(async () => {
    await Promise.all(
      Array.from(document.getElementsByTagName("img"), (image) => {
        if (image.complete) {
          return;
        }

        return new Promise((resolve, reject) => {
          image.addEventListener("load", resolve);
          image.addEventListener("error", reject);
        });
      })
    );
  });

  const { file, folder } = getOutput(route);
  fs.mkdirSync(getPath(folder), { recursive: true });

  await page.screenshot({
    type: "png",
    path: getPath(file),
  });

  await page.close();
}

export default capturePage;
