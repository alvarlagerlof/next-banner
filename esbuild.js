require("esbuild")
  .build({
    entryPoints: ["src/index.ts", "src/cli/index.ts"],
    external: ["react", "react-dom", "next"],
    platform: "node",
    bundle: true,
    minify: false,
    sourcemap: true,
    target: "esnext",
    outdir: "dist",
  })
  .catch(() => process.exit(1));
