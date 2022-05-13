#!/usr/bin/env node

import task from "tasuku";

import { startBrowser, startNextServer } from "./runtime";
import readRoutes from "./routes";

import { CaptureScreenshot, ExtractData } from "./operation";
import { getConfig } from "../config";

export type LogsWithRoute = Array<{ route: string; message: string }>;

(async function generate() {
  await task("Startup", async ({ task }) => {
    return await task.group(
      (task) => [
        task("Browser", async ({ setError }) => {
          try {
            return await startBrowser();
          } catch (e) {
            setError(e);
          }
        }),

        task("Next.js server", async ({ setError }) => {
          try {
            return await startNextServer();
          } catch (e) {
            setError(e);
          }
        }),

        task("Routes", async ({ setError }) => {
          try {
            return await readRoutes();
          } catch (e) {
            setError(e);
          }
        }),
      ],
      {
        concurrency: 3,
        stopOnError: true,
      }
    );
  })
    .then(async ({ result: [browser, server, routes] }) => {
      if (
        browser.state === "success" &&
        server.state === "success" &&
        routes.state === "success" &&
        browser.result &&
        server.result &&
        routes.result
      ) {
        await task("Screenshot pages", async ({ task, setStatus, setOutput }) => {
          let counter = 0;
          const logs: LogsWithRoute = [];
          const { layoutDir, concurrency } = await getConfig();

          async function doWork(iterator) {
            for (const [, route] of iterator) {
              const nestedTask = await task(`Route: ${route}`, async () => {
                const extractData = new ExtractData(await browser!.result!.newPage());
                await extractData.loadUrl(`http://localhost:${server!.result!.port}${route}`);
                const { layout, meta, custom } = await extractData.extract();
                await extractData.close();

                const captureScreenshot = new CaptureScreenshot(await browser!.result!.newPage());
                await captureScreenshot.insertData({ layout, meta, custom });
                await captureScreenshot.loadUrl(
                  `http://localhost:${server!.result!.port}/${layoutDir}/${layout}`
                );
                await captureScreenshot.capture(route);
                await captureScreenshot.close();

                // Add route to logs array
                const combined = [...extractData.logs, ...captureScreenshot.logs];
                const withRoute: LogsWithRoute = combined.map((log) => ({ route, message: log }));
                logs.push(...withRoute);
                setOutput(renderLogs(logs));
              });
              setStatus(`${++counter}/${routes!.result!.length}`);
              nestedTask.clear();
            }
          }

          // Starts n workers sharing the same iterator
          const iterator = routes!.result!.entries();
          const workers = new Array(concurrency).fill(iterator).map(doWork);
          await Promise.allSettled(workers);
        });

        await task("Shutdown", async ({ task }) => {
          return await task.group(
            (task) => [
              task("Browser", async ({ setError }) => {
                try {
                  await browser!.result!.close();
                } catch (e) {
                  setError(e);
                }
              }),

              task("Next.js server", async ({ setError }) => {
                try {
                  server?.result?.serverProcess.kill("SIGINT");
                } catch (e) {
                  setError(e);
                }
              }),
            ],
            {
              concurrency: 2,
              stopOnError: true,
            }
          );
        });
      }
    })
    .catch((e) => {});

  process.exit();
})();

function renderLogs(logs: LogsWithRoute) {
  let output = "";

  for (const { route, message } of logs) {
    output += `${route} ${message}\n`;
  }

  return output;
}
