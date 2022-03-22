import { Browser } from "puppeteer";
import { merge } from "merge-anything";

import { NextServer, Logs } from "../types";
import { DEFAULT_LAYOUT } from "../../constants";
import { Meta, Payload } from "../../types";

async function extractMeta(
  browser: Browser,
  server: NextServer,
  logs: Logs,
  route: string
): Promise<Payload> {
  const page = await browser.newPage();
  const url = `http://localhost:${server.port}${route}`;

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

  // Extract relevant meta tags for easier default use
  const meta = await page.evaluate(() => {
    const title =
      document.head.querySelector("title")?.textContent ?? undefined;
    const description =
      document.head
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ?? undefined;

    const meta: Meta = {
      title,
      description,
    };

    return meta;
  });

  // Read potential custom data from window
  const payload = await page.evaluate(() => {
    return (window.NextBanner as Payload) ?? {};
  });

  console.log(payload);

  await page.close();

  return merge(
    {
      layout: DEFAULT_LAYOUT,
      data: {},
    },
    { data: meta },
    payload
  );

  // return {
  //   ...{
  //     layout: DEFAULT_LAYOUT,
  //     data: {},
  //   },
  //   ...{ data: meta },
  //   ...payload,
  // };
}

export default extractMeta;
