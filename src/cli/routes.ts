import { Route } from "../types";
import { getPath, loadFile } from "./file";
import getConfig from "./config";
import {
  IBuildManifest,
  INextManifest,
  IPreRenderManifest,
} from "./interfaces";

const config = getConfig();

async function getRoutes(): Promise<Route[]> {
  const MANIFESETS: INextManifest = {
    build: loadFile<IBuildManifest>(
      getPath(config.sourceDir, "build-manifest.json")
    ),
    preRender: loadFile<IPreRenderManifest>(
      getPath(getPath(config.sourceDir, "prerender-manifest.json"))
    ),
  };

  const staticRoutes: Route[] = Object.keys(MANIFESETS?.build?.pages ?? []).map(
    (key) => {
      return key as Route;
    }
  );

  const dynamicRoutes: Route[] = Object.keys(
    MANIFESETS?.preRender?.routes ?? []
  ).map((key) => {
    return key as Route;
  });

  return filter([...staticRoutes, ...dynamicRoutes]);
}

async function filter(routes: Route[]): Promise<Route[]> {
  const builtIn = (route: Route): boolean => {
    return ![
      "/_app",
      "/_error",
      "/500",
      "/404",
      ...config.excludePages,
    ].includes(route);
  };
  const dynamic = (route: Route): boolean => {
    return !/\/\[.*\]/.test(route);
  };

  const ogImage = (route: Route): boolean => {
    return !/_ogimage/.test(route);
  };

  return routes.filter(builtIn).filter(dynamic).filter(ogImage);
}

function toFilename(route: Route): string {
  if (route === "/") return "index";

  return route.replace("/", "");
}

export { getRoutes, toFilename };
