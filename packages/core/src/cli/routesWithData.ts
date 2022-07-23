import { readdir } from "fs/promises";
import { getConfig } from "../config";
import { getPath } from "./file";

export default async function routesWithData() {
  const { nextDir } = await getConfig();

  const pagesDir = getPath(nextDir, "server", "pages");

  walkPath(pagesDir);
}

async function walkPath(path: string) {
  const content = await readdir(path, { withFileTypes: true });

  const files = content.filter((item) => item.isFile()).map((file) => file.name);

  for


  const directories = content.filter((item) => !item.isFile()).map((directory) => directory.name);

}

function extractMeta(path: string) {

}

funciton screen