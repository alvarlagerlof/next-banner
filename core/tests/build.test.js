import fs from "node:fs/promises";
import { spawn } from "node:child_process";

jest.setTimeout(30 * 1000);

test("it builds and images are generated", async () => {
  spawn("rm", ["-rf", "./public/next-banner-generated"], { cwd: "../example" });

  const child = spawn("yarn", ["build"], { cwd: "../example" });

  process.stdin.pipe(child.stdin);

  for await (const data of child.stdout) {
    // console.log(data.toString());
  }

  const isEmpty = await fs.readdir("../example/public/next-banner-generated").then((files) => {
    return files.length === 0;
  });

  expect(isEmpty).toBe(false);
});
