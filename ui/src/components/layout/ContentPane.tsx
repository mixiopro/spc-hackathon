"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ParameterEditor } from "@/components/ui/parameter-editor";
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  LiveRun,
} from "@/components/revid/playground";

interface ContentPaneProps {
  className?: string;
}

// Default parameters
const defaultParams = {
  name: "world",
  color: "#42b883",
};

export const ContentPane: React.FC<ContentPaneProps> = ({ className }) => {
  // State management
  const [liveParams, setLiveParams] =
    useState<Record<string, any>>(defaultParams);
  const [code, setCode] = useState<string>(""); // Initialize with empty string or default code

  // Fixed aspect ratio and width for preview
  const aspectRatio = 16 / 9;
  const width = 480;

  // Handler for parameter changes
  const handleParameterChange = (newParams: Record<string, any>) => {
    setLiveParams(newParams);
  };

  return (
    <div className={`w-full h-full bg-background p-4 ${className}`}>
      <LiveProvider
        code={code}
        autoCompile={true}
        parameters={liveParams}
        width={width}
        aspectRatio={aspectRatio}
      >
        <div className="flex items-center justify-end mb-4">
          <LiveRun />
        </div>
        <Tabs
          defaultValue="render"
          className="flex-1 flex flex-col overflow-hidden"
        >
          <TabsList className="w-full bg-card p-0 h-12">
            <TabsTrigger
              value="render"
              className="flex-1 data-[state=active]:bg-accent"
            >
              Render
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="flex-1 data-[state=active]:bg-accent"
            >
              Code
            </TabsTrigger>
            <TabsTrigger
              value="spec"
              className="flex-1 data-[state=active]:bg-accent"
            >
              Spec
            </TabsTrigger>
          </TabsList>

          <TabsContent
            value="render"
            className="h-[calc(100%-3rem)] bg-card rounded-md p-4"
          >
            <Card className="relative h-full">
              <div className="absolute inset-0">
                <LivePreview
                  width={width}
                  height={width / aspectRatio}
                  variables={liveParams}
                />
              </div>
              <LiveError className="absolute bottom-0 left-0 right-0 text-destructive p-2" />
            </Card>
          </TabsContent>

          <TabsContent
            value="code"
            className="h-[calc(100%-3rem)] bg-card rounded-md p-4"
          >
            <Card className="h-full">
              <LiveEditor className="w-full h-full font-mono text-sm" />
            </Card>
          </TabsContent>

          <TabsContent
            value="spec"
            className="h-[calc(100%-3rem)] bg-card rounded-md p-4"
          >
            <Card className="h-full">
              <ParameterEditor
                parameters={liveParams}
                onParameterChange={handleParameterChange}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </LiveProvider>
    </div>
  );
};

export default ContentPane;
