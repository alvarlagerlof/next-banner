import { Browser } from "puppeteer";
import { Logs, NextServer } from "../types";
import captureScreenshot from "./captureScreenshot";
import extractMeta from "./extractMeta";

export default async function operation(
  browser: Browser,
  server: NextServer,
  route: string
): Promise<Logs> {
  const logs: Logs = [];

  const payload = await extractMeta(browser, server, logs, route);
  await captureScreenshot(browser, server, logs, route, payload);

  return logs;
}
