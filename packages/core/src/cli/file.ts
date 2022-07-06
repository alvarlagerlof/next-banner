import path from "path";
import fs from "fs/promises";

function getPath(...pathSegment: string[]): string {
  return path.resolve(process.cwd(), ...pathSegment);
}

async function loadFile<T>(path: string): Promise<T | undefined> {
  const file = await fs.readFile(path);
  return JSON.parse(file.toString()) as T;
}

export { getPath, loadFile };
