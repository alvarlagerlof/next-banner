require("esbuild")
  .build({
    entryPoints: ["src/client/index.ts"],
    external: ["react", "react-dom", "next"],
    bundle: true,
    minify: false,
    sourcemap: true,
    target: "esnext",
    format: "esm",
    outdir: "dist/client",
  })
  .catch(() => process.exit(1));

require("esbuild")
  .build({
    entryPoints: ["src/cli/index.ts"],
    platform: "node",
    bundle: true,
    minify: false,
    sourcemap: true,
    target: "esnext",
    format: "cjs",
    outdir: "dist/cli",
  })
  .catch(() => process.exit(1));
