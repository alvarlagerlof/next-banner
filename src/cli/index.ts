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
      const data = await extractMeta(browser, server, route);
      await capturePage(browser, server, route, data);
    })
  );

  browser.close();
  server.process.kill();
}

generate();
