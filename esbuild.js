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
    external: ["react", "react-dom", "next"],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["es2020", "node12"],
    format: "cjs",
    outdir: "dist/client",
    platform: "neutral",
    ...watchModeOptions,
  })
  .catch(() => process.exit(1));

require("esbuild")
  .build({
    entryPoints: ["src/cli/index.ts"],
    platform: "node",
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ["es2020", "node12"],
    format: "cjs",
    outdir: "dist/cli",
    external: ["puppeteer"],
    ...watchModeOptions,
  })
  .catch(() => process.exit(1));
