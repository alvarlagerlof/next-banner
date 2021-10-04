import { Browser } from "puppeteer";
import fs from "fs";

import {
  NextServer,
  MetaResult,
  Logs,
  MetaDefaults,
  CaptureResult,
} from "./types";
import { getPath } from "./file";
import getConfig from "./config";
import { DEFAULT_LAYOUT, OUTPUT_DIR } from "../constants";
import { Payload } from "../types";

const config = getConfig();

function getMetaUrl(server: NextServer, route: string): string {
  return `http://localhost:${server.port}${route}`;
}

function getLayoutUrl(server: NextServer, layout: string): string {
  return `http://localhost:${server.port}/_ogimage/${layout}`;
}

async function extractMeta(
  browser: Browser,
  server: NextServer,
  route: string
): Promise<MetaResult> {
  const logs: Logs = [];
  const page = await browser.newPage();
  const url = getMetaUrl(server, route);

  try {
    page
      .on("console", (message) =>
        logs.push({
          route,
          message: `${message.type().toUpperCase()} ${message.text()}`,
        })
      )
      .on("pageerror", (message) =>
        logs.push({
          route,
          message,
        })
      );

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    const meta: MetaDefaults = await page.evaluate(() => {
      const title = document.head.querySelector("title");

      const description = document.head.querySelector(
        'meta[name="description"]'
      );

      return {
        title: title?.textContent ?? undefined,
        description: description?.getAttribute("content") ?? undefined,
      };
    });

    const ogImageData: Payload = await page.evaluate((DEFAULT_LAYOUT) => {
      const base = {
        data: {},
        layout: DEFAULT_LAYOUT,
      };

      if (window.NextOpengraphImage) {
        return window.NextOpengraphImage as Payload;
      }

      return base;
    }, DEFAULT_LAYOUT);

    await page.close();

    return {
      payload: {
        data: { ...meta, ...ogImageData.data },
        layout: ogImageData.layout,
      },
      logs,
    };
  } catch (e) {
    console.log(e);
    await page.close();
    throw new Error(`Route ${route}: ${e.message}`);
  }
}

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
  route: string,
  payload: Payload
): Promise<CaptureResult> {
  const logs: Logs = [];

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

  await page.goto(getLayoutUrl(server, payload.layout), {
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

  return { logs };
}

export { extractMeta, capturePage };
