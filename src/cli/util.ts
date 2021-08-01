import { promises } from "fs";
import { OUTPUT_DIR } from "../constants";

import { Meta } from "../types";
import getConfig from "./config";

const config = getConfig();

async function readJson(path: string): Promise<object> {
  const file = await promises.readFile(path);
  return JSON.parse(file.toString());
}

function getBaseUrl(): string {
  return `http://localhost:${config.serverPort}`;
}

function getLayoutUrl(meta: Meta): string {
  const base = getBaseUrl();
  const title = encodeURIComponent(meta.title);
  const description = encodeURIComponent(meta.description);

  return `${base}${config.layoutRoute}/?title=${title}&description=${description}`;
}

function getOutputFolderPath() {
  return `public/${OUTPUT_DIR}`;
}

export { readJson, getBaseUrl, getLayoutUrl, getOutputFolderPath };
