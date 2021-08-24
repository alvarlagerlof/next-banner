#!/usr/bin/env node

import cliProgress from "cli-progress";
import chalk from "chalk";

import { getBrowser, getNextServer } from "./runtime";
import getRoutes from "./routes";
import { extractMeta, capturePage as captureRoute } from "./operation";
import { CaptureResult, Logs, MetaResult } from "./types";

async function generate() {
  console.log("✨ next-opengraph-image ✨");

  try {
    const browser = await getBrowser();
    const server = await getNextServer();
    const routes = await getRoutes();

    const bar = new cliProgress.SingleBar(
      {
        format:
          "Capturing [{bar}] {percentage}% | ETA: {eta}s | {value}/{total} pages",
      },
      cliProgress.Presets.shades_classic
    );
    console.log("");
    bar.start(routes.length, 0);

    const errors: Error[] = [];
    const logs: Logs = [];

    await Promise.all(
      routes.map(async (route) => {
        try {
          const metaResult: MetaResult = await extractMeta(
            browser,
            server,
            route
          );
          const captureResult: CaptureResult = await captureRoute(
            browser,
            server,
            route,
            metaResult.layout,
            metaResult.data
          );

          logs.push(...metaResult.logs);
          logs.push(...captureResult.logs);

          bar.increment();
        } catch (e) {
          errors.push(e);
        }
      })
    );

    bar.stop();

    if (logs.length > 0) {
      console.log(`\Console log ${chalk.blue("ⓘ")}`);
      logs.forEach((log) => {
        console.error(chalk.dim(`- ${log.route}: ${log.message}`));
      });
    }

    if (errors.length > 0) {
      console.log(`Captured ${routes.length - errors.length} pages`);

      console.log(`Errors ${chalk.red("✗")}`);
      errors.forEach((e) => {
        console.error(chalk.dim(`- ${e.message}`));
      });
    } else {
      console.log(
        `\n${chalk.green("✔")} Captured ${routes.length} pages successfully`
      );
    }

    browser.close();
    server.serverProcess.kill("SIGINT");
    process.exit();
  } catch (e) {
    process.exit();
  }
}

generate();
