import { Browser } from "puppeteer";
import fs, { promises } from "fs";

import { Meta, Route } from "../types";
import { getBaseUrl, getLayoutUrl, getOutputFolderPath } from "./util";
import { toFilename } from "./routes";
import { getPath } from "./file";

async function extractMeta(browser: Browser, route: Route): Promise<Meta> {
  const page = await browser.newPage();

  const base = getBaseUrl();
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
  route: Route,
  meta: Meta
): Promise<void> {
  const url = getLayoutUrl(meta);

  const page = await browser.newPage();

  await page.setViewport({
    width: 2000,
    height: 1200,
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

  console.log("Captured:", route);
  await page.close();
}

export { extractMeta, capturePage };
