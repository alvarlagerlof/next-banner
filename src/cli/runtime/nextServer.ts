import { spawn } from "child_process";
import getPort from "get-port";

import { NextServer } from "../types";

async function getNextServer(): Promise<NextServer> {
  const port = await getPort();

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

export default getNextServer;
