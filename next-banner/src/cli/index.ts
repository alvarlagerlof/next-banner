#!/usr/bin/env node

import task from "tasuku";

import { Logs } from "./types";

import getBrowser from "./runtime/browser";
import getNextServer from "./runtime/nextServer";
import getRoutes from "./routes";
import operation from "./operation";

// async function generate() {
//   try {
//     const {
//       result: { browser, server, routes },
//     } = await task("Starting", async ({ task }) => {
//       const { result: browser } = await task("Browser", async () => {
//         return await getBrowser();
//       });

//       const { result: server } = await task("Next.js server", async () => {
//         return await getNextServer();
//       });

//       const { result: routes } = await task("Routes", async () => {
//         return await getRoutes();
//       });

//       return { browser, server, routes };
//     });

//     await task("Screenshot pages", async ({ setStatus, setOutput }) => {
//       let counter = 0;
//       const logs: Logs = [];

//       await Promise.all(
//         routes.map(async (route) => {
//           try {
//             logs.push(...(await operation(browser, server, route)));

//             setOutput(
//               logs.reduce(
//                 (acc: string, curr) => acc + `${curr.route} ${curr.message}\n`,
//                 ""
//               )
//             );

//             //throw new Error("Hello there, failed!");

//             counter++;
//           } catch (e) {
//             throw new Error(`Route ${route}: ${e.message}`);
//           }

//           setStatus(`${counter}/${routes.length}`);
//         })
//       );
//     })
//       .catch((e) => {
//         console.error(e);
//       })
//       .finally(async () => {
//         await browser.close();
//         server.serverProcess.kill("SIGINT");
//         process.exit();
//       });
//   } catch (e) {
//     console.log("Top-level fail");
//     console.log(e.message);
//     process.exit();
//   }
// }

async function generate() {
  await task("Starting", async ({ task }) => {
    const { result: browser } = await task("Browser", async () => {
      return await getBrowser();
    });

    const { result: server } = await task("Next.js server", async () => {
      return await getNextServer();
    });

    const { result: routes } = await task("Routes", async () => {
      return await getRoutes();
    });

    return { browser, server, routes };
  })
    .then(async ({ result: { browser, server, routes } }) => {
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
                (acc: string, curr) => acc + `${curr.route} ${curr.message}\n`,
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
    })
    .catch((e) => {
      console.log("Top-level error", e.message);
    })
    .finally(async () => {
      process.exit();
    });
}

generate();
