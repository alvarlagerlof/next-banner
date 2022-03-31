#!/usr/bin/env node

import task from "tasuku";

import { Logs } from "./types";

import getBrowser from "./runtime/browser";
import getNextServer from "./runtime/nextServer";
import getRoutes from "./routes";

import { CaptureScreenshot, ExtractData } from "./operation";
import { LAYOUT_DIR } from "../constants";

async function generate() {
  await task("Starting", async ({ task }) => {
    return await task.group(
      (task) => [
        task("Browser", async () => {
          return await getBrowser();
        }),

        task("Next.js server", async () => {
          return await getNextServer();
        }),

        task("Routes", async () => {
          return await getRoutes();
        }),
      ],
      {
        concurrency: 3,
      }
    );
  })
    .then(
      async ({
        result: {
          results: [browser, server, routes],
        },
      }) => {
        await task("Screenshot pages", async ({ setStatus, setOutput }) => {
          const logs: Logs = [];
          let counter = 0;

          await Promise.all(
            routes.map(async (route) => {
              const extractData = new ExtractData(await browser.newPage());
              await extractData.loadUrl(`http://localhost:${server.port}${route}`);
              const { layout, meta, custom } = await extractData.extract();
              await extractData.close();

              const captureScreenshot = new CaptureScreenshot(await browser.newPage());
              await captureScreenshot.insertData({ layout, meta, custom });
              await captureScreenshot.loadUrl(`http://localhost:${server.port}/${LAYOUT_DIR}/${layout}`);
              await captureScreenshot.capture(route);
              await captureScreenshot.close();

              logs.push(...extractData.logs, ...captureScreenshot.logs);
              setOutput(renderLogs(route, logs));
              setStatus(`${++counter}/${routes.length}`);
            })
          );
        }).finally(async () => {
          await browser.close();
          server.serverProcess.kill("SIGINT");
          process.exit();
        });
      }
    )
    .finally(async () => {
      process.exit();
    });
}

generate();

function renderLogs(route, logs: Logs) {
  let output = "";

  for (const message of logs) {
    output += `${route} ${message}\n`;
  }

  return output;
}
