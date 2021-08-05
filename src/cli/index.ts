#!/usr/bin/env node

import { getBrowser, getNextServer } from "./runtime";
import getRoutes from "./routes";
import { extractMeta, capturePage } from "./operation";

async function generate() {
  const browser = await getBrowser();
  const server = await getNextServer();
  const routes = await getRoutes();

  await Promise.all(
    routes.map(async (route) => {
      try {
        const meta = await extractMeta(browser, server, route);
        await capturePage(browser, server, route, meta.layout, meta.data);
      } catch (e) {
        console.log(e.message);
      }
    })
  );

  browser.close();
  server.serverProcess.kill();
}

generate();
