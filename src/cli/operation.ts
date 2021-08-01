import { Browser } from "puppeteer";
import fs, { promises } from "fs";

import { Meta, NextServer, Route } from "../types";
import { toFilename } from "./routes";
import { getPath } from "./file";
import getConfig from "./config";
import { OUTPUT_DIR } from "../constants";

const config = getConfig();

function getOutputFolderPath() {
  return `public/${OUTPUT_DIR}`;
}

function getBaseUrl(server: NextServer): string {
  return `http://localhost:${server.port}`;
}

function getLayoutUrl(server: NextServer, meta: Meta): string {
  const base = getBaseUrl(server);
  const title = encodeURIComponent(meta.title);
  const description = encodeURIComponent(meta.description);

  return `${base}/_ogimage/?title=${title}&description=${description}`;
}

async function extractMeta(
  browser: Browser,
  server: NextServer,
  route: Route
): Promise<Meta> {
  const page = await browser.newPage();

  const base = getBaseUrl(server);
  const url = `${base}${route}`;

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  return new Promise(async (resolve, reject) => {
    try {
      const title = await page.evaluate(() => {
        const selector = document.head.querySelector("title");
        if (!selector) throw new Error(`${route} No title tag found`);

        const content = selector.textContent;
        if (!content) throw new Error(`${route} No title content found`);

        return content;
      });

      const description = await page.evaluate(() => {
        const selector = document.head.querySelector(
          'meta[name="description"]'
        );
        if (!selector)
          throw new Error(`${route} No description tag found on route`);

        const content = selector.getAttribute("content");
        if (!content) throw new Error(`${route} No description content found`);

        return content;
      });

      await page.close();
      resolve({
        title,
        description,
      });
    } catch (e) {
      await page.close();
      reject(e);
    }
  });
}

async function capturePage(
  browser: Browser,
  server: NextServer,
  route: Route,
  meta: Meta
): Promise<void> {
  const url = getLayoutUrl(server, meta);

  const page = await browser.newPage();

  await page.setViewport({
    width: config.width,
    height: config.height,
  });

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  const full = `${getOutputFolderPath()}/${toFilename(route)}.png`;
  const folder = full.replace(/\/[^/]+$/, "");

  if (!fs.existsSync(getPath(folder))) {
    await promises.mkdir(getPath(folder));
  }

  await page.screenshot({
    type: "png",
    path: full,
  });

  console.log("Captured og:image for:", route);
  await page.close();
}

export { extractMeta, capturePage };
