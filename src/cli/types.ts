import { ChildProcessWithoutNullStreams } from "child_process";

type AnyJson = boolean | number | string | null | JsonArray | JsonMap;
type JsonArray = Array<AnyJson>;
export interface JsonMap {
  [key: string]: AnyJson;
}

export type Data = {
  meta: {
    title: string;
    description: string;
  };
  custom: JsonMap | null;
  layout: string;
};

export type NextServer = {
  port: number;
  process: ChildProcessWithoutNullStreams;
};

export type Route = `/${string}`;
