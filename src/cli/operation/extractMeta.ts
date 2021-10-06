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

    const meta: Meta = await page.evaluate(() => {
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
      data: { ...meta, ...ogImageData.data },
      layout: ogImageData.layout,
    };
  } catch (e) {
    await page.close();
    throw new Error(`Route ${route}: ${e.message}`);
  }
}

export default extractMeta;
