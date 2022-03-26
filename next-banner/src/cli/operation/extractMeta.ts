import { Browser } from "puppeteer";
import { NextServer, Logs } from "../types";
import { DEFAULT_LAYOUT } from "../../constants";
import { Meta, Payload, Custom } from "../../types";

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

    return {
      title,
      description,
    } as Meta;
  });

  // Read potential custom data from window
  const custom = await page.evaluate(() => {
    return (window.NextBannerPayload?.custom as Custom) ?? {};
  });

  const layout = await page.evaluate((DEFAULT_LAYOUT) => {
    return (window.NextBannerPayload?.layout as string) ?? DEFAULT_LAYOUT;
  }, DEFAULT_LAYOUT);

  return {
    layout,
    meta,
    custom,
  };
}

export default extractMeta;
