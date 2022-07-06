const fs = require("node:fs/promises");

test("images have been generated", async () => {
  const amount = await fs
    .readdir("./public/next-banner-generated")
    .then((files) => {
      return files.length;
    });

  expect(amount).toBeGreaterThan(0);
});
