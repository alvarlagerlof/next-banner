import { Browser } from "puppeteer";
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

  // const meta: Meta = await page.evaluate(() => {
  //   const title = document.head.querySelector("title");

  //   const description = document.head.querySelector('meta[name="description"]');

  //   return {
  //     title: title?.textContent ?? undefined,
  //     description: description?.getAttribute("content") ?? undefined,
  //   };
  // });

  // const ogImageData: Payload = await page.evaluate((DEFAULT_LAYOUT) => {
  //   const base = {
  //     data: {},
  //     layout: DEFAULT_LAYOUT,
  //   };

  //   if (window.NextBanner) {
  //     return window.NextBanner as Payload;
  //   }

  //   return base;
  // }, DEFAULT_LAYOUT);

  const payload = await page.evaluate((DEFAULT_LAYOUT) => {
    // Base data to use in case no thing is found
    const base: Payload = {
      layout: "de",
      data: {},
    };

    // Extract relevant meta tags for easier default use
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

    // Read potential custom data from window
    const payload = (window.NextBanner as Payload) ?? {};

    const r = {
      ...base,
    };

    return r;

    // return {
    //   //...base,
    //   // ...{ data: meta },
    //   // ...payload,
    // };
  }, DEFAULT_LAYOUT);

  await page.close();

  return payload;

  // return {
  //   data: { ...meta, ...ogImageData.data },
  //   layout: ogImageData.layout,
  // };
}

export default extractMeta;
