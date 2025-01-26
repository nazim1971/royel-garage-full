import { ReactNode } from "react";

export type TRoute = {
  name: string;
  path?: string;
  element?: ReactNode;
  children?: TRoute[];
};