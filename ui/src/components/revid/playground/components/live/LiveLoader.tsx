import React from "react";

import { cn } from "@/lib/utils";

import { useLive } from "./LiveContext";

export interface LiveLoaderProps {
  /**
   * Function to determine if loading should be shown
   * Default: Shows loading when isLoading is true or isPlayerReady is false
   */
  shouldShowLoading?: (context: ReturnType<typeof useLive>) => boolean;
  /**
   * Custom loader component
   */
  Loader?: React.ComponentType<{ className?: string }>;
  /**
   * Additional className for positioning
   */
  className?: string;
  /**
   * Additional className for the loader
   */
  loaderClassName?: string;
}

const defaultShouldShowLoading = ({
  isLoading,
  isPlayerReady,
}: ReturnType<typeof useLive>) => {
  return isLoading === true || isPlayerReady === false;
};

const DefaultLoader: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900",
      className,
    )}
  />
);

export const LiveLoader: React.FC<LiveLoaderProps> = ({
  shouldShowLoading = defaultShouldShowLoading,
  Loader = DefaultLoader,
  className,
  loaderClassName,
}) => {
  const context = useLive();
  const isLoading = shouldShowLoading(context);

  console.log("isLoading", isLoading);

  if (!isLoading) return null;

  return (
    <div
      id="player-loader"
      className={cn("flex items-center justify-center", className)}
    >
      <Loader className={loaderClassName} />
    </div>
  );
};

export default LiveLoader;
