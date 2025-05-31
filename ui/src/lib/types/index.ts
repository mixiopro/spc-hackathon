import { Project } from '@revideo/core';

export type ModuleExports = Record<string, any>;
export type ModuleResolver = (moduleName: string) => ModuleExports;
export type ModuleCache = Map<string, ModuleExports>;

export interface ModuleProxyConfig {
  resolvers: Record<string, ModuleResolver>;
  transformImport?: (moduleName: string) => string;
  cache?: boolean;
}

export interface PreviewProps {
  code: string;
  parameters?: any;
  onChange?: (code: string) => void;
  showCode?: boolean;
  height?: string;
  width?: string;
  className?: string;
}
