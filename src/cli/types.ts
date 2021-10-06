import { ChildProcess } from "child_process";
export interface NextServer {
  port: number;
  serverProcess: ChildProcess;
}
export interface Log {
  route: string;
  message: string;
}

export type Logs = Log[];

export interface Config {
  nextDir: string;
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
