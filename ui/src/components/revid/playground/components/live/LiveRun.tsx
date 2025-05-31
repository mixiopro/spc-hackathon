"use client";

import React from "react";

import { Button } from "@/components/ui/button";

import { useLive } from "./LiveContext";

interface LiveRunProps {
  className?: string;
  children?: React.ReactNode;
}

export function LiveRun({ className, children }: LiveRunProps) {
  const { compile, isLoading, autoCompile } = useLive();

  // // Don't render if autoCompile is enabled
  // if (autoCompile) {
  //   return null;
  // }

  return (
    <Button
      onClick={() => compile()}
      disabled={isLoading}
      className={className}
      // type="button"
    >
      {children || (isLoading ? "Compiling..." : "Run")}
    </Button>
  );
}
