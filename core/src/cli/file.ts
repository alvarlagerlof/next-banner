import path from "path";
import fs from "fs";

function getPath(...pathSegment: string[]): string {
  return path.resolve(process.cwd(), ...pathSegment);
}

function loadFile<T>(path: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, file) => {
      if (err || !file) {
        reject(err);
      }

      const json: T = JSON.parse(file.toString()) as T;

      resolve(json);
    });
  });
}

export { getPath, loadFile };
