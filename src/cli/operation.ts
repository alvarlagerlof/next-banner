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
import {
  DATA_NAMES,
  DEFAULT_LAYOUT,
  OUTPUT_DIR,
  WINDOW_VAR,
} from "../constants";
import { JsonMap } from "../types";

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
  try {
    const logs: Logs = [];

    const page = await browser.newPage();

    const url = getMetaUrl(server, route);

    page
      .on("console", (message) =>
        logs.push({
          route,
          message: `${message.type().toUpperCase()} ${message.text()}`,
        })
      )
      .on("pageerror", ({ message }) =>
        logs.push({
          route,
          message,
        })
      );

    await page.goto(url, {
      waitUntil: "networkidle0",
    });

    try {
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

      const ogImageTag: Partial<MetaResult> = await page.evaluate(
        (DATA_NAMES) => {
          const selector = document.head.querySelector(
            'meta[property="og:image"]'
          );

          if (!selector) throw new Error("No tag found");

          const data = JSON.parse(
            atob(selector.getAttribute(DATA_NAMES.base64) ?? btoa("{}"))
          ) as JsonMap;

          const layout =
            selector.getAttribute(DATA_NAMES.layout) ?? DEFAULT_LAYOUT;

          return {
            data,
            layout,
          };
        },
        DATA_NAMES
      );

      await page.close();

      return {
        data: { ...meta, ...ogImageTag.data },
        layout: ogImageTag.layout ?? DEFAULT_LAYOUT,
        logs,
      };
    } catch (e) {
      page.close();
      throw new Error(`Route ${route}: ${e.message}`);
    }
  } catch (e) {
    throw new Error(e);
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
  data: JsonMap
): Promise<CaptureResult> {
  try {
    const logs: Logs = [];

    const url = getLayoutUrl(server, layout);

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

    await page.close();

    return { logs };
  } catch (e) {
    throw new Error(e);
  }
}

export { extractMeta, capturePage };
