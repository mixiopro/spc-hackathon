"use client";

import { createContext, useContext } from "react";
import { Project } from "@revideo/core";

import { ParameterValue } from "../../types/parameters";

export interface LiveContextType {
  // Code state
  code: string;
  onCodeChange: (code: string) => void;

  // Compilation state
  error: Error | null;
  compiled: Project | null;
  isReady: boolean;
  isLoading: boolean;
  isPlayerReady: boolean;

  setIsPlayerReady: (val: boolean) => void;

  // Compilation control
  autoCompile: boolean;
  setAutoCompile: (auto: boolean) => void;
  compile: () => Promise<void>;

  // Parameter management
  parameters: Record<string, ParameterValue>;
  updateParameters: (params: Record<string, ParameterValue>) => void;

  // Global configuration
  globals: Record<string, any>;
  updateGlobals: (globals: Record<string, any>) => void;
}

export const LiveContext = createContext<LiveContextType | null>(null);

export function useLive() {
  const context = useContext(LiveContext);
  if (!context) {
    throw new Error("useLive must be used within a LiveProvider");
  }
  return context;
}
