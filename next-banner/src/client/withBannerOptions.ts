import { NextConfig } from "next";
import { BannerConfig } from "../types";

import fs from "node:fs";

// import WebpackShellPlugin from "webpack-shell-plugin-next";

// // const fs = require("fs");

// import fs from "fs";
// // const fs = require("fs");

// class HelloWorldPlugin {
//   apply(compiler) {
//     // compiler.hooks.additionalPass.tap("Hello World Plugin", (stats) => {
//     //   // console.log("Hello World! 1");
//     //   // console.log("Hello World! 2");
//     //   isThere();
//     // });

//     // compiler.hooks.infrastructureLog.tap("Hello World Plugin", (stats) => {
//     //   // console.log("Hello there", stats);
//     //   isThere();
//     // });

//     compiler.hooks.thisCompilation.tap("Hello World Plugin", (compilation) => {
//       // Tapping to the assets processing pipeline on a specific stage.
//       compilation.hooks.processAssets.tap(
//         {
//           name: "Hello World Plugin",

//           // Using one of the later asset processing stages to ensure
//           // that all assets were already added to the compilation by other plugins.
//           stage: 5000,
//         },
//         (assets) => {
//           // console.log(assets);
//           for (const asset in assets) {
//             // if (asset == "../pages/index.js") {
//             //   console.log(assets[asset]);
//             // }
//             //console.log("-----");
//             //console.log(asset);
//             //console.log(assets[asset]?._source?._children);
//           }
//           // console.log(assets._source._children);
//         }
//       );
//     });
//   }
// }

// function isThere() {
//   if (fs.existsSync("./.next/server/pages/index.html")) {
//     console.log("exitsts");
//   } else {
//     console.log("no exist soory");
//   }
// }

export default function withBannerOptions(options: Partial<BannerConfig> = {}) {
  // console.log("I am here");

  try {
    fs.writeFileSync(
      "./.next/next-banner.json",
      JSON.stringify(options, null, 2)
    );
  } catch (err) {
    console.error(err);
  }

  return (nextConfig: NextConfig) => ({
    ...nextConfig,

    webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
      // Important: return the modified config
      //config.plugins.push(new HelloWorldPlugin());
      return config;
    },
    publicRuntimeConfig: {
      ...nextConfig.publicRuntimeConfig,
      nextBannerOptions: options,
    },
  });
}
