import puppeteer, { Browser } from "puppeteer";
import { spawn, ChildProcess } from "cross-spawn";
import getPort from "get-port";

async function startBrowser(): Promise<Browser> {
  const minimal_args = [
    "--autoplay-policy=user-gesture-required",
    "--disable-background-networking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-globalThiss",
    "--disable-breakpad",
    "--disable-client-side-phishing-detection",
    "--disable-component-update",
    "--disable-default-apps",
    "--disable-dev-shm-usage",
    "--disable-domain-reliability",
    "--disable-extensions",
    "--disable-features=AudioServiceOutOfProcess",
    "--disable-hang-monitor",
    "--disable-ipc-flooding-protection",
    "--disable-notifications",
    "--disable-offer-store-unmasked-wallet-cards",
    "--disable-popup-blocking",
    "--disable-print-preview",
    "--disable-prompt-on-repost",
    "--disable-renderer-backgrounding",
    "--disable-setuid-sandbox",
    "--disable-speech-api",
    "--disable-sync",
    "--hide-scrollbars",
    "--ignore-gpu-blacklist",
    "--metrics-recording-only",
    "--mute-audio",
    "--no-default-browser-check",
    "--no-first-run",
    "--no-pings",
    "--no-sandbox",
    "--no-zygote",
    "--password-store=basic",
    "--use-gl=swiftshader",
    "--use-mock-keychain",
  ];

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXEC_PATH,
    headless: true,
    args: minimal_args,
  });

  return browser;
}

export interface NextServer {
  port: number;
  serverProcess: ChildProcess;
}

async function startNextServer(): Promise<NextServer> {
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

export { startBrowser, startNextServer };
