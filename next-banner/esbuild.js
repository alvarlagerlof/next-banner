const [watch] = process.argv.slice(2);

let watchModeOptions = {};

if (watch) {
  watchModeOptions = {
    watch: {
      onRebuild(error, result) {
        if (error) console.error("watch build failed:", error);
        else console.log("watch build succeeded:", result);
      },
    },
  };
}

require("esbuild")
  .build({
    entryPoints: ["src/client/index.ts"],
    outdir: "dist/client",
    external: ["react", "react-dom", "next"],
    platform: "node",
    bundle: true,
    minify: false,
    sourcemap: true,
    target: ["es2020", "node12"],
    format: "cjs",
    ...watchModeOptions,
  })
  .catch(() => process.exit(1));

require("esbuild")
  .build({
    entryPoints: ["src/cli/index.ts"],
    outdir: "dist/cli",
    external: ["puppeteer"],
    platform: "node",
    bundle: true,
    minify: false,
    sourcemap: true,
    target: ["es2020", "node12"],
    format: "cjs",
    ...watchModeOptions,
  })
  .catch(() => process.exit(1));
