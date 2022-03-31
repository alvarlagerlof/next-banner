#!/usr/bin/env node

import task from "tasuku";

import { Logs, LogsWithRoute } from "./types";

import getBrowser from "./runtime/browser";
import getNextServer from "./runtime/nextServer";
import getRoutes from "./routes";

import { CaptureScreenshot, ExtractData } from "./operation";
import { LAYOUT_DIR } from "../constants";
import getConfig from "./config";

(async function generate() {
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
        await task("Screenshot pages", async ({ task, setStatus, setOutput }) => {
          let counter = 0;
          const logs: LogsWithRoute = [];

          async function doWork(iterator) {
            for (const [index, route] of iterator) {
              const nestedTask = await task(`Route: ${route}`, async () => {
                const extractData = new ExtractData(await browser.newPage());
                await extractData.loadUrl(`http://localhost:${server.port}${route}`);
                const { layout, meta, custom } = await extractData.extract();
                await extractData.close();

                const captureScreenshot = new CaptureScreenshot(await browser.newPage());
                await captureScreenshot.insertData({ layout, meta, custom });
                await captureScreenshot.loadUrl(`http://localhost:${server.port}/${LAYOUT_DIR}/${layout}`);
                await captureScreenshot.capture(route);
                await captureScreenshot.close();

                // Add route to logs array
                const combined = [...extractData.logs, ...captureScreenshot.logs];
                const withRoute = combined.map((log) => ({ route, message: log }));
                logs.push(...withRoute);
                setOutput(renderLogs(logs));
              });
              setStatus(`${++counter}/${routes.length}`);
              nestedTask.clear();
            }
          }

          // Starts n workers sharing the same iterator
          const iterator = routes.entries();
          const { concurrency } = getConfig();
          const workers = new Array(concurrency).fill(iterator).map(doWork);
          await Promise.allSettled(workers);

          // Shut down processes
        }).finally(async () => {
          await browser.close();
          server.serverProcess.kill("SIGINT");
        });

        // await task("Screenshot pages", async ({ task, setStatus }) => {
        //   let counter = 0;
        //   await Promise.all(
        //     routes.map(async (route) => {
        //       const nestedTask = await task(`Route: ${route}`, async ({ task }) => {
        //         const extractData = new ExtractData(await browser.newPage());
        //         await extractData.loadUrl(`http://localhost:${server.port}${route}`);
        //         const { layout, meta, custom } = await extractData.extract();
        //         await extractData.close();
        //         const captureScreenshot = new CaptureScreenshot(await browser.newPage());
        //         await captureScreenshot.insertData({ layout, meta, custom });
        //         await captureScreenshot.loadUrl(`http://localhost:${server.port}/${LAYOUT_DIR}/${layout}`);
        //         await captureScreenshot.capture(route);
        //         await captureScreenshot.close();
        //       });
        //       setStatus(`${++counter}/${routes.length}`);
        //       nestedTask.clear();
        //     })
        //   );
        // });
        // await task("Screenshot pages", async ({ task, setStatus }) => {
        //   let counter = 0;
        //   for (const route of routes) {
        //     const nestedTask = await task(`Route: ${route}`, async ({ task }) => {
        //       await new Promise((r) => setTimeout(r, 2000));
        //     });
        //     setStatus(`${++counter}/${routes.length}`);
        //     nestedTask.clear();
        //   }
        // });
        // await task.group(
        //   (task) =>
        //     routes.map((route) => {
        //       return task(`Route: ${route}`, async () => {
        //         const extractData = new ExtractData(await browser.newPage());
        //         await extractData.loadUrl(`http://localhost:${server.port}${route}`);
        //         const { layout, meta, custom } = await extractData.extract();
        //         await extractData.close();
        //         const captureScreenshot = new CaptureScreenshot(await browser.newPage());
        //         await captureScreenshot.insertData({ layout, meta, custom });
        //         await captureScreenshot.loadUrl(`http://localhost:${server.port}/${LAYOUT_DIR}/${layout}`);
        //         await captureScreenshot.capture(route);
        //         await captureScreenshot.close();
        //         // logs.push(...extractData.logs, ...captureScreenshot.logs);
        //         // setOutput(renderLogs(route, logs));
        //         // setStatus(`${++counter}/${routes.length}`);
        //       });
        //     }),
        //   {
        //     concurrency: 10, // Number of tasks to run at a time
        //   }
        // );
        // await task("Screenshot pages", async ({ setStatus, setOutput }) => {
        //   const logs: Logs = [];
        //   let counter = 0;
        //   await Promise.all(
        //     routes.map(async (route) => {
        //       const extractData = new ExtractData(await browser.newPage());
        //       await extractData.loadUrl(`http://localhost:${server.port}${route}`);
        //       const { layout, meta, custom } = await extractData.extract();
        //       await extractData.close();
        //       const captureScreenshot = new CaptureScreenshot(await browser.newPage());
        //       await captureScreenshot.insertData({ layout, meta, custom });
        //       await captureScreenshot.loadUrl(`http://localhost:${server.port}/${LAYOUT_DIR}/${layout}`);
        //       await captureScreenshot.capture(route);
        //       await captureScreenshot.close();
        //       logs.push(...extractData.logs, ...captureScreenshot.logs);
        //       setOutput(renderLogs(route, logs));
        //       setStatus(`${++counter}/${routes.length}`);
        //     })
        //   );
        // }).finally(async () => {
        //   await browser.close();
        //   server.serverProcess.kill("SIGINT");
        //   process.exit();
        // });
      }
    )
    .finally(async () => {
      process.exit();
    });
})();

function renderLogs(logs: LogsWithRoute) {
  let output = "";

  for (const { route, message } of logs) {
    output += `${route} ${message}\n`;
  }

  return output;
}
