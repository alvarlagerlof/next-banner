import path from "path";
import fs from "fs";

function getPath(...pathSegment: string[]): string {
  return path.resolve(process.cwd(), ...pathSegment);
}

function loadFile<T>(path: string, throwError = true): T | undefined {
  if (fs.existsSync(path)) {
    const file = fs.readFileSync(path);
    const json: T = JSON.parse(file.toString()) as T;

    return json;

    //return require(path) as T;
  }

  if (throwError) {
    new Error(`${path} does not exist.`);
  }
}

export { getPath, loadFile };
