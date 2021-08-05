import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import puppeteer, { Browser } from "puppeteer";
import getPort from "get-port";

import { NextServer } from "./types";
import { ENV_VAR } from "../constants";
import process from "process";

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
    const serverProcess = spawn("yarn", ["start", "-p", port.toString()], {});

    serverProcess.stdout?.on("data", (data) => {
      if (data.toString().includes("started server on")) {
        resolve({
          serverProcess,
          port,
        });
      }
    });

    serverProcess.stderr?.on("data", (data) => {
      reject(new Error(`stderr: ${data}`));
    });

    serverProcess.on("error", (error) => {
      reject(new Error(`error: ${error.message}`));
    });

    serverProcess.on("close", (code) => {
      reject(new Error(`child process exited with code ${code}`));
    });
  });
}

export { getBrowser, getNextServer };
