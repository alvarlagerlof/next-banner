import { Browser } from "puppeteer";
import fs from "fs";

import { NextServer, Logs } from "../types";
import { getPath } from "../file";
import getConfig from "../config";
import { Payload } from "../../types";
import { LAYOUT_DIR, OUTPUT_DIR } from "../../constants";

// const config = getConfig();

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

async function captureScreenshot(
  browser: Browser,
  server: NextServer,
  logs: Logs,
  route: string,
  payload: Payload
): Promise<void> {
  const page = await browser.newPage();

  page
    .on("console", (message) => {
      logs.push({
        route,
        message: `${message.type().toUpperCase()} ${message.text()}`,
      });
    })
    .on("pageerror", (message) => logs.push({ route, message }))
    .on("error", (message) => logs.push({ route, message }));

  page.on("console", async (msg) => {
    const args = await msg.args();
    args.forEach(async (arg) => {
      const val = await arg.jsonValue();
      // value is serializable
      if (JSON.stringify(val) !== JSON.stringify({})) console.log(val);
      // value is unserializable (or an empty oject)
      else {
        const { type, subtype, description } = arg._remoteObject;
        console.log(
          `type: ${type}, subtype: ${subtype}, description:\n ${description}`
        );
      }
    });
  });

  // Insert extreacted data
  await page.evaluateOnNewDocument(async (payload) => {
    window.NextBannerPayload = payload;
  }, payload);

  const layoutUrl = `http://localhost:${server.port}/${LAYOUT_DIR}/${payload.layout}`;

  await page.goto(layoutUrl, {
    waitUntil: "networkidle0",
  });

  const { width, height } = await page.evaluate(async () => {
    await new Promise((r) => setTimeout(r, 20000));

    return {
      width: window.NextBannerConfig.width,
      height: window.NextBannerConfig.height,
    };
  });

  await page.setViewport({
    width,
    height,
  });

  const { file, folder } = getOutput(route);
  fs.mkdirSync(getPath(folder), { recursive: true });

  await page.screenshot({
    type: "jpeg",
    path: getPath(file),
  });

  await page.close();
}

export default captureScreenshot;
