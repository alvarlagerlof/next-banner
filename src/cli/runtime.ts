import { spawn } from "child_process";
import puppeteer, { Browser } from "puppeteer";
import getPort from "get-port";
import ora from "ora";

import { NextServer } from "./types";

async function getBrowser(): Promise<Browser> {
  const spinner = ora("Starting browser").start();

  try {
    const options = { headless: true };

    const browser = await puppeteer.launch(options);
    spinner.succeed();

    return browser;
  } catch (e) {
    spinner.fail(e.message);
    throw new Error(e);
  }
}

async function getNextServer(): Promise<NextServer> {
  const port = await getPort();

  const spinner = ora(`Starting server at port: ${port}`).start();

  return new Promise((resolve, reject) => {
    const serverProcess = spawn("yarn", ["start", "-p", port.toString()], {});

    serverProcess.stdout?.on("data", (data) => {
      if (data.toString().includes("started server on")) {
        spinner.succeed();
        resolve({
          serverProcess,
          port,
        });
      }
    });

    serverProcess.stderr?.on("data", (data) => {
      spinner.fail(data.toString());
      reject(new Error(`stderr: ${data}`));
    });

    serverProcess.on("error", (error) => {
      spinner.fail(error.message);
      reject(new Error(`error: ${error.message}`));
    });

    serverProcess.on("close", (code) => {
      spinner.fail(code?.toString());
      reject(new Error(`child process exited with code ${code}`));
    });
  });
}

export { getBrowser, getNextServer };
