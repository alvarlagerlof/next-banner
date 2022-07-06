import fs from "node:fs";

import { Page } from "puppeteer";
import { DEFAULT_LAYOUT } from "../constants";
import { Custom, Meta, DataWithLayout } from "../types";
import { getConfig } from "../config";
import { getPath } from "./file";

class BasePuppeteerOperation {
  page: Page;
  logs: string[];

  constructor(page: Page) {
    this.page = page;
    this.logs = [];

    this.recordConsole();
  }

  async loadUrl(url: string) {
    await this.page.goto(url, {
      timeout: 0,
      waitUntil: "networkidle0",
    });
  }

  async close() {
    await this.page.close();
  }

  recordConsole() {
    this.page
      .on("console", (message) => this.logs.push(`${message.type().toUpperCase()} ${message.text()}`))
      .on("pageerror", (message) => this.logs.push(message))
      .on("error", (message) => this.logs.push(message));
  }
}

export class ExtractData extends BasePuppeteerOperation {
  async extract(): Promise<DataWithLayout> {
    const meta = await this.extractMeta();
    const custom = await this.extractCustom();
    const layout = await this.extractLayout();

    return { meta, custom, layout };
  }

  private async extractMeta(): Promise<Meta> {
    return await this.page.evaluate(() => {
      const title = document.head.querySelector("title")?.textContent ?? undefined;
      const description =
        document.head.querySelector('meta[name="description"]')?.getAttribute("content") ?? undefined;

      return {
        title,
        description,
      } as Meta;
    });
  }

  private async extractCustom(): Promise<Custom> {
    return await this.page.evaluate(() => {
      return (globalThis.NextBannerData?.custom as Custom) ?? ({} as Custom);
    });
  }

  private async extractLayout(): Promise<string> {
    return await this.page.evaluate((DEFAULT_LAYOUT) => {
      return (globalThis.NextBannerData?.layout as string) ?? DEFAULT_LAYOUT;
    }, DEFAULT_LAYOUT);
  }
}

export class CaptureScreenshot extends BasePuppeteerOperation {
  async insertData({ layout, meta, custom }: DataWithLayout) {
    await this.page.evaluateOnNewDocument(
      async (layout, meta, custom) => {
        globalThis.NextBannerData = {
          layout,
          meta,
          custom,
        };
      },
      layout,
      meta,
      custom
    );
  }

  async capture(route: string) {
    const { width, height } = await getConfig();

    await this.page.setViewport({
      width,
      height,
    });

    const { file, folder } = await getOutput(route);
    fs.mkdirSync(getPath(folder), { recursive: true });

    await this.page.screenshot({
      type: "jpeg",
      path: getPath(file),
    });
  }
}

async function getOutput(route: string) {
  const { outputDir } = await getConfig();

  const outputFolder = `public/${outputDir}`;
  const indexFixedRoute = route === "/" ? "index" : route.replace("/", "");

  const file = `${outputFolder}/${indexFixedRoute}.jpg`;
  const folder = file.replace(/\/[^/]+$/, "");

  return {
    folder,
    file,
  };
}
