#!/usr/bin/env node

import task from "tasuku";

import { Logs } from "./types";

import getBrowser from "./runtime/browser";
import getNextServer from "./runtime/nextServer";
import getRoutes from "./routes";
import operation from "./operation";
import extractMeta from "./operation/extractMeta";
import captureScreenshot from "./operation/captureScreenshot";

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
          let counter = 0;
          const logs: Logs = [];

          await Promise.all(
            routes.map(async (route) => {
              // await operation(browser, server, route);

              counter++;

              // const payload = await extractMeta(browser, server, logs, route);
              // await captureScreenshot(browser, server, logs, route, payload);

              logs.push(...(await operation(browser, server, route)));

              setOutput(
                logs.reduce(
                  (acc: string, curr) =>
                    acc + `${curr.route} ${curr.message}\n`,
                  ""
                )
              );

              setStatus(`${counter}/${routes.length}`);
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
