#!/usr/bin/env node

import { getBrowser, getNextServer } from "./runtime";
import { getRoutes } from "./routes";
import { extractMeta, capturePage } from "./operation";

async function generate() {
  const browser = await getBrowser();
  const server = await getNextServer();
  const routes = await getRoutes();

  await Promise.all(
    routes.map(async (route) => {
      const meta = await extractMeta(browser, server, route);
      await capturePage(browser, server, route, meta);
    })
  );

  browser.close();
  server.process.kill();
}

generate();
