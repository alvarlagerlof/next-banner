import { ChildProcess } from "child_process";

type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
type JsonArray = Array<AnyJson>;
export interface JsonMap {
  [key: string]: AnyJson;
}

export type Data = JsonMap;

export type NextServer = {
  port: number;
  serverProcess: ChildProcess;
};
