import { getPath, loadFile } from "./file";
import { getConfig } from "../config";

interface BuildManifest {
  pages: {
    [key: string]: string[];
  };
}

interface PreRenderManifest {
  routes: {
    [key: string]: unknown;
  };
}

interface NextManifest {
  build?: BuildManifest;
  preRender?: PreRenderManifest;
}

async function readRoutes(): Promise<string[]> {
  const { nextDir } = await getConfig();

  const MANIFESETS: NextManifest = {
    build: await loadFile<BuildManifest>(getPath(nextDir, "build-manifest.json")),
    preRender: await loadFile<PreRenderManifest>(getPath(getPath(nextDir, "prerender-manifest.json"))),
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
  const { layoutDir, excludePages } = await getConfig();

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

export default readRoutes;
