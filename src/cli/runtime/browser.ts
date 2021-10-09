import puppeteer, { Browser } from "puppeteer";
import ora from "ora";

async function getBrowser(): Promise<Browser> {
  const spinner = ora("Starting browser").start();

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    spinner.succeed();

    return browser;
  } catch (e) {
    if (e instanceof Error) {
      spinner.fail(e.message);
    }
    throw e;
  }
}

export default getBrowser;
