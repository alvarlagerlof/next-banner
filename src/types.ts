import { ChildProcessWithoutNullStreams } from "child_process";

export type Meta = {
  title: string;
  description: string;
};

export type NextServer = {
  port: number;
  process: ChildProcessWithoutNullStreams;
};

export type Route = `/${string}`;
