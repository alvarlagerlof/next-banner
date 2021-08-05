export interface Config {
  sourceDir: string;
  excludePages: string[];
  width: number;
  height: number;
}

export interface BuildManifest {
  pages: {
    [key: string]: string[];
  };
}

export interface PreRenderManifest {
  routes: {
    [key: string]: unknown;
  };
}

export interface NextManifest {
  build?: BuildManifest;
  preRender?: PreRenderManifest;
}
