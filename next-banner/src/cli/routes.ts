import { getPath, loadFile } from "./file";
import { getConfig } from "../config";
import { BuildManifest, NextManifest, PreRenderManifest } from "./types";

const { layoutDir, excludePages, nextDir: nextDir } = getConfig();

async function getRoutes(): Promise<string[]> {
  const MANIFESETS: NextManifest = {
    build: loadFile<BuildManifest>(getPath(nextDir, "build-manifest.json")),
    preRender: loadFile<PreRenderManifest>(getPath(getPath(nextDir, "prerender-manifest.json"))),
  };

  const staticRoutes: string[] = Object.keys(MANIFESETS?.build?.pages ?? []).map((key) => {
    return key as string;
  });

  const dynamicRoutes: string[] = Object.keys(MANIFESETS?.preRender?.routes ?? []).map((key) => {
    return key as string;
  });

  return filter([...staticRoutes, ...dynamicRoutes]);
}

async function filter(routes: string[]): Promise<string[]> {
  const builtIn = (route: string): boolean => {
    return !["/_app", "/_error", "/500", "/404", ...excludePages].includes(route);
  };

  const dynamic = (route: string): boolean => {
    return !/\/\[.*\]/.test(route);
  };

  const layouts = (route: string): boolean => {
    return !route.includes(layoutDir);
  };

  return routes.filter(builtIn).filter(dynamic).filter(layouts);
}

export default getRoutes;
