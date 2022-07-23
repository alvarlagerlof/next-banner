#!/usr/bin/env node

import task from "tasuku";

import { startBrowser } from "./runtime";
import readRoutes from "./routes";

import { CaptureScreenshot, ExtractData } from "./operation";
import { getConfig } from "../config";

export type LogsWithRoute = Array<{ route: string; message: string }>;

(async function generate() {
  const { state } = await task("next-banner", async ({ task, setError }) => {
    const [{ result: browser }, { result: routes }] = await task.group(
      (task) => [
        task("Starting browser", async () => {
          return await startBrowser();
        }),

        task("Getting routes", async () => {
          return await readRoutes();
        }),
      ],
      {
        concurrency: 3,
        stopOnError: false,
      }
    );

    await task("Screenshoting pages", async ({ task, setStatus, setOutput }) => {
      try {
        let counter = 0;
        const logs: LogsWithRoute = [];
        const { layoutDir, concurrency } = await getConfig();

        // Starts n workers sharing the same iterator
        const iterator = routes!.entries();
        const workers = new Array(concurrency).fill(iterator).map(async (iterator) => {
          try {
            for (const [, route] of iterator) {
              const nestedTask = await task(`Route: ${route}`, async () => {
                try {
                  const extractData = new ExtractData(await browser!.newPage());
                  await extractData.loadUrl(`http://localhost:${server!.port}${route}`);
                  const { layout, meta, custom } = await extractData.extract();
                  await extractData.close();

                  const captureScreenshot = new CaptureScreenshot(await browser!.newPage());
                  await captureScreenshot.insertData({ layout, meta, custom });
                  await captureScreenshot.loadUrl(`http://localhost:${server!.port}/${layoutDir}/${layout}`);
                  await captureScreenshot.capture(route);
                  await captureScreenshot.close();

                  // Add route to logs array
                  const combined = [...extractData.logs, ...captureScreenshot.logs];
                  const withRoute: LogsWithRoute = combined.map((log) => ({ route, message: log }));
                  logs.push(...withRoute);
                  setOutput(renderLogs(logs));
                } catch (e) {
                  setError(e);
                }
              });
              setStatus(`${++counter}/${routes!.length}`);
              nestedTask.clear();
            }
          } catch (e) {
            setError(e);
          }
        });
        await Promise.allSettled(workers);
      } catch (e) {
        setError(e);
      }
    });

    await task("Stopping browser", async () => {
      await browser.close();
    });
  });

  if (state == "error") {
    process.exit(1);
  }

  process.exit();
})();

function renderLogs(logs: LogsWithRoute) {
  let output = "";

  for (const { route, message } of logs) {
    output += `${route} ${message}\n`;
  }

  return output;
}
