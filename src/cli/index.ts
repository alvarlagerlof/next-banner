#!/usr/bin/env node

import cliProgress from "cli-progress";
import chalk from "chalk";

import { getBrowser, getNextServer } from "./runtime";
import getRoutes from "./routes";
import { extractMeta, capturePage } from "./operation";

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

    bar.start(routes.length, 0);

    const errors: Error[] = [];

    await Promise.all(
      routes.map(async (route) => {
        try {
          const meta = await extractMeta(browser, server, route);
          await capturePage(browser, server, route, meta.layout, meta.data);

          bar.increment();
        } catch (e) {
          errors.push(e);
        }
      })
    );

    bar.stop();

    if (errors.length > 0) {
      console.log(
        `\n${chalk.green("✔")} Captured ${routes.length - errors.length} pages`
      );

      console.log(`${chalk.red("✗")} Errors`);
      errors.forEach((e) => {
        console.error(chalk.grey("  - " + e.message));
      });
    } else {
      console.log(`\n${chalk.green("✔")} Captured all pages successfully`);
    }

    browser.close();
    server.serverProcess.kill("SIGINT");
    process.exit();
  } catch (e) {
    process.exit();
  }
}

generate();
