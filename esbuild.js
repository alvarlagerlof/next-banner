require("esbuild")
  .build({
    entryPoints: ["src/client/index.ts"],
    external: ["react", "react-dom", "next"],
    bundle: true,
    minify: false,
    sourcemap: true,
    target: ["es2020", "node12"],
    format: "cjs",
    outdir: "dist/client",
    platform: "neutral",
  })
  .catch(() => process.exit(1));

require("esbuild")
  .build({
    entryPoints: ["src/cli/index.ts"],
    platform: "node",
    bundle: true,
    minify: false,
    sourcemap: true,
    target: ["es2020", "node12"],
    format: "cjs",
    outdir: "dist/cli",
  })
  .catch(() => process.exit(1));
