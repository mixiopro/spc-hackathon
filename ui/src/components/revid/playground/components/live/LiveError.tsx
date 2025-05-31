"use client";

import React from "react";

import { useLive } from "./LiveContext";

interface LiveErrorProps {
  className?: string;
}

export function LiveError({ className = "" }: LiveErrorProps) {
  const { error } = useLive();

  if (!error) {
    return null;
  }

  return (
    <div className={`p-4 bg-destructive/10 text-destructive rounded-lg ${className}`}>
      <h3 className="text-sm font-medium">Error</h3>
      <pre className="mt-2 text-xs whitespace-pre-wrap">{error.message}</pre>
    </div>
  );
}
