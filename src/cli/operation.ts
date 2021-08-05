import { Browser } from "puppeteer";
import fs from "fs";

import { Data, NextServer } from "./types";
import { getPath } from "./file";
import getConfig from "./config";
import { DATA_NAMES, OUTPUT_DIR, WINDOW_VAR } from "../constants";

const config = getConfig();

function getMetaUrl(server: NextServer, route: string): string {
  return `http://localhost:${server.port}${route}`;
}

function getLayoutUrl(server: NextServer, layout: string): string {
  return `http://localhost:${server.port}/_ogimage/${layout}`;
}

type DataAndLayout = {
  data: Data;
  layout: string;
};

async function extractMeta(
  browser: Browser,
  server: NextServer,
  route: string
): Promise<DataAndLayout> {
  const page = await browser.newPage();

  const url = getMetaUrl(server, route);

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  try {
    const tag: DataAndLayout = await page.evaluate((DATA_NAMES) => {
      const selector = document.head.querySelector('meta[property="og:image"]');

      if (!selector) throw new Error("No tag found");

      const data = JSON.parse(
        atob(selector.getAttribute(DATA_NAMES.base64) ?? btoa("{}"))
      ) as Data;

      const layout = selector.getAttribute(DATA_NAMES.layout) ?? "default";

      return {
        data,
        layout,
      };
    }, DATA_NAMES);

    await page.close();

    return {
      data: tag.data,
      layout: tag.layout,
    };
  } catch (e) {
    page.close();
    throw new Error(`Route ${route}: ${e.message}`);
  }
}

function getOutput(route: string, layout: string) {
  const outputFolder = `public/${OUTPUT_DIR}`;
  const indexFixedRoute = route === "/" ? "index" : route.replace("/", "");

  const file = `${outputFolder}/${layout}/${indexFixedRoute}.png`;
  const folder = file.replace(/\/[^/]+$/, "");

  return {
    folder,
    file,
  };
}

async function capturePage(
  browser: Browser,
  server: NextServer,
  route: string,
  layout: string,
  data: Data
): Promise<void> {
  const url = getLayoutUrl(server, layout);

  const page = await browser.newPage();

  await page.setViewport({
    width: config.width,
    height: config.height,
  });

  page
    .on("console", (message) =>
      console.log(
        `${message.type().substr(0, 3).toUpperCase()} ${message.text()}`
      )
    )
    .on("pageerror", ({ message }) => console.log(message));

  await page.evaluateOnNewDocument(
    (WINDOW_VAR, data) => {
      window[WINDOW_VAR] = data;
    },
    WINDOW_VAR,
    data
  );

  await page.goto(url, {
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
  const { file, folder } = getOutput(route, layout);
  fs.mkdirSync(getPath(folder), { recursive: true });

  await page.screenshot({
    type: "png",
    path: getPath(file),
  });

  console.log("Captured og:image for:", route);
  await page.close();
}

export { extractMeta, capturePage };
