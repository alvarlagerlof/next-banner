import { ChildProcess } from "child_process";
export interface NextServer {
  port: number;
  serverProcess: ChildProcess;
}

export type Logs = string[];

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
