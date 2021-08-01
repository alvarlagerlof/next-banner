import puppeteer, { Browser } from "puppeteer";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";

import getConfig from "./config";

const config = getConfig();

async function getBrowser(): Promise<Browser> {
  console.log("Starting browser");

  const options = process.env.CI
    ? {}
    : {
        headless: false,
        executablePath:
          process.platform === "win32"
            ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      };

  return await puppeteer.launch(options);
}

async function getNextServer(): Promise<ChildProcessWithoutNullStreams> {
  console.log("Starting server at port:", config.serverPort);

  const server = spawn("yarn", ["start", "-p", config.serverPort.toString()]);

  return new Promise((resolve, reject) => {
    server.stdout.on("data", (data) => {
      if (data.toString().includes("ready - started server on")) {
        resolve(server);
      }
    });

    server.stderr.on("data", (data) => {
      reject(`stderr: ${data}`);
    });

    server.on("error", (error) => {
      reject(`error: ${error.message}`);
    });

    server.on("close", (code) => {
      reject(`child process exited with code ${code}`);
    });
  });
}

export { getBrowser, getNextServer };
