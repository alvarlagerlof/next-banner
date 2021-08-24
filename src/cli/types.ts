import { ChildProcess } from "child_process";
import { JsonMap } from "../types";

export interface NextServer {
  port: number;
  serverProcess: ChildProcess;
}

export interface MetaDefaults {
  title?: string;
  description?: string;
}

export interface Log {
  route: string;
  message: string;
}

export type Logs = Log[];

export interface MetaResult {
  data: JsonMap;
  layout: string;
  logs: Logs;
}

export interface CaptureResult {
  logs: Logs;
}
