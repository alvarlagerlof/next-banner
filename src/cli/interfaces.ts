export interface IConfig {
  sourceDir: string;
  excludePages: string[];
  width: number;
  height: number;
}

export interface IBuildManifest {
  pages: {
    [key: string]: string[];
  };
}

export interface IPreRenderManifest {
  routes: {
    [key: string]: unknown;
  };
}

export interface INextManifest {
  build?: IBuildManifest;
  preRender?: IPreRenderManifest;
}
