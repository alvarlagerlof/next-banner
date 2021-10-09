import puppeteer, { Browser } from "puppeteer";

async function getBrowser(): Promise<Browser> {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });

  return browser;
}

export default getBrowser;
