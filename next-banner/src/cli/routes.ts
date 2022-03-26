import { getPath, loadFile } from "./file";
import getConfig from "./config";
import { BuildManifest, NextManifest, PreRenderManifest } from "./types";
import { LAYOUT_DIR as BANNER_DIR } from "../constants";

const config = getConfig();

async function getRoutes(): Promise<string[]> {
  const MANIFESETS: NextManifest = {
    build: loadFile<BuildManifest>(getPath(".next", "build-manifest.json")),
    preRender: loadFile<PreRenderManifest>(
      getPath(getPath(".next", "prerender-manifest.json"))
    ),
  };

  const staticRoutes: string[] = Object.keys(
    MANIFESETS?.build?.pages ?? []
  ).map((key) => {
    return key as string;
  });

  const dynamicRoutes: string[] = Object.keys(
    MANIFESETS?.preRender?.routes ?? []
  ).map((key) => {
    return key as string;
  });

  return filter([...staticRoutes, ...dynamicRoutes]);
}

async function filter(routes: string[]): Promise<string[]> {
  const builtIn = (route: string): boolean => {
    return ![
      "/_app",
      "/_error",
      "/500",
      "/404",
      ...config.excludePages,
    ].includes(route);
  };

  const dynamic = (route: string): boolean => {
    return !/\/\[.*\]/.test(route);
  };

  const banners = (route: string): boolean => {
    return !route.includes(BANNER_DIR);
  };

  return routes.filter(builtIn).filter(dynamic).filter(banners);
}

export default getRoutes;
