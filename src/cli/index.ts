#!/usr/bin/env node

import cliProgress from "cli-progress";
import chalk from "chalk";

import getBrowser from "./runtime/browser";
import getNextServer from "./runtime/nextserver";

import getRoutes from "./routes";
import extractMeta from "./operation/extractMeta";
import capture from "./operation/capture";

import { Logs } from "./types";

async function generate() {
  console.log("✨ next-banner ✨");

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
          const payload = await extractMeta(browser, server, logs, route);
          await capture(browser, server, logs, route, payload);

          bar.increment();
        } catch (e) {
          errors.push(e);
        }
      })
    );

    bar.stop();

    if (logs.length > 0) {
      console.log(`\nConsole log ${chalk.blue("ⓘ")}`);
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

    await browser.close();
    server.serverProcess.kill("SIGINT");
    process.exit();
  } catch (e) {
    process.exit();
  }
}

generate();
