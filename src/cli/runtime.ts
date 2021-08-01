import { spawn } from "child_process";
import puppeteer, { Browser } from "puppeteer";
import getPort from "get-port";

import { NextServer } from "../types";

async function getBrowser(): Promise<Browser> {
  console.log("Starting browser");

  const options = process.env.CI
    ? {}
    : {
        headless: true,
        executablePath:
          process.platform === "win32"
            ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      };

  return await puppeteer.launch(options);
}

async function getNextServer(): Promise<NextServer> {
  const port = await getPort();
  console.log("Starting server at port:", port);

  return new Promise((resolve, reject) => {
    const process = spawn("yarn", ["start", "-p", port.toString()]);

    process.stdout.on("data", (data) => {
      if (data.toString().includes("ready - started server on")) {
        resolve({
          process,
          port,
        });
      }
    });

    process.stderr.on("data", (data) => {
      reject(new Error(`stderr: ${data}`));
    });

    process.on("error", (error) => {
      reject(new Error(`error: ${error.message}`));
    });

    process.on("close", (code) => {
      reject(new Error(`child process exited with code ${code}`));
    });
  });
}

export { getBrowser, getNextServer };
