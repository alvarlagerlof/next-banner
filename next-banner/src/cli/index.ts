#!/usr/bin/env node

import task from "tasuku";

import { Logs } from "./types";

import getBrowser from "./runtime/browser";
import getNextServer from "./runtime/nextServer";
import getRoutes from "./routes";
import operation from "./operation";

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
              await operation(browser, server, route);

              counter++;

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
        })
          .catch((e) => {
            throw new Error(e);
          })
          .finally(async () => {
            await browser.close();
            server.serverProcess.kill("SIGINT");
            process.exit();
          });
      }
    )
    .catch((e) => {
      console.log("Top-level error", e.message);
    })
    .finally(async () => {
      process.exit();
    });
}

generate();
