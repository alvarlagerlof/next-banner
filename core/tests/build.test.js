import fs from "node:fs/promises";
import { spawn, exec } from "node:child_process";

jest.setTimeout(60 * 1000);

test("it builds and images are generated", async () => {
  spawn("rm", ["-rf", "./public/next-banner-generated"], { cwd: "../example" });

  console.log(
    await new Promise((resolve, reject) => {
      exec("cd ../example && yarn build", (error, stdout, stderr) => {
        if (error) {
          reject(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    })
  );

  const isEmpty = await fs.readdir("../example/public/next-banner-generated").then((files) => {
    return files.length === 0;
  });
  expect(isEmpty).toBe(false);
});
