import { Browser } from "puppeteer";
import fs, { promises } from "fs";
import { Buffer } from "buffer";

import { Data, JsonMap, NextServer, Route } from "../types";
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

function getLayoutUrl(server: NextServer, data: Data): string {
  const base = getBaseUrl(server);

  const meta = Buffer.from(JSON.stringify(data.meta), "utf-8").toString(
    "base64"
  );
  const custom = Buffer.from(
    JSON.stringify(data.custom ?? {}),
    "utf-8"
  ).toString("base64");

  return `${base}/_ogimage/?meta=${meta}&custom=${custom}`;
}

async function extractMeta(
  browser: Browser,
  server: NextServer,
  route: Route
): Promise<Data> {
  const page = await browser.newPage();

  const base = getBaseUrl(server);
  const url = `${base}${route}`;

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  try {
    const title = await page.evaluate(() => {
      const selector = document.head.querySelector("title");
      if (!selector) throw new Error(`No title tag found`);

      const content = selector.textContent;
      if (!content) throw new Error(`No title content found`);

      return content;
    });

    const description = await page.evaluate(() => {
      const selector = document.head.querySelector('meta[name="description"]');
      if (!selector) throw new Error(`No description tag found on route`);

      const content = selector.getAttribute("content");
      if (!content) throw new Error(`No description content found`);

      return content;
    });

    const custom =
      (await page.evaluate(() => {
        const selector = document.head.querySelector(
          'meta[name="next-opengraph-image"]'
        );

        if (!selector) return null;

        const content = selector.getAttribute("content");
        if (!content) return null;

        return content;
      })) ?? Buffer.from("{}", "utf-8").toString("base64");

    const customDecoded = JSON.parse(
      Buffer.from(custom, "base64").toString("utf-8")
    ) as JsonMap;
    await page.close();

    return {
      meta: {
        title,
        description,
      },
      custom: customDecoded,
    };
  } catch (e) {
    page.close();
    throw new Error(`Route ${route}: ${e.message}`);
  }
}

async function capturePage(
  browser: Browser,
  server: NextServer,
  route: Route,
  data: Data
): Promise<void> {
  const url = getLayoutUrl(server, data);

  const page = await browser.newPage();

  await page.setViewport({
    width: config.width,
    height: config.height,
  });

  await page.goto(url, {
    waitUntil: "networkidle0",
  });

  page.on("pageerror", function (err) {
    console.log("Page error: " + err.toString());
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
