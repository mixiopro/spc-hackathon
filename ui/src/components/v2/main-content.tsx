"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeTab from "../../app/copilotkit/preview/tabs/code-tab";
import RenderTab from "../../app/copilotkit/preview/tabs/render-tab";
import SpecTab from "../../app/copilotkit/preview/tabs/spec-tab";
import { TabContentWrapper } from "../../app/copilotkit/preview/components/TabContentWrapper";
import {
  LiveProvider,
  LivePreview,
  LiveError,
  LiveEditor,
} from "../revid/playground";
import { Card } from "../ui/card";
import { ParameterEditor } from "../ui/parameter-editor";
import { useCoAgent } from "@copilotkit/react-core";
import { useState } from "react";
import { AgentState } from "../../lib/types";
import { Monitor, Code, FileText } from "lucide-react";

// Default parameters matching PlaygroundRenderer
const defaultParams = {
  name: "world",
  color: "#42b883",
};

export default function MainContent() {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });

  console.log("🚀 -----------------🚀");
  console.log("🚀 ~MainContent state:", state);
  console.log("🚀 -----------------🚀");
  const [liveParams, setLiveParams] =
    useState<Record<string, any>>(defaultParams);

  // Fixed aspect ratio and width matching PlaygroundRenderer
  const aspectRatio = 16 / 9;
  const width = 480;

  // Handler for parameter changes
  const handleParameterChange = (newParams: Record<string, any>) => {
    setLiveParams(newParams);
  };
  return (
    <>
      <LiveProvider
        code={state.final_result?.code || ""}
        autoCompile={true}
        parameters={liveParams}
        width={width}
        aspectRatio={aspectRatio}
      >
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border">
            <Tabs defaultValue="render" className="w-full">
              <TabsList className="grid w-full grid-cols-3 border-0 p-1">
                <TabsTrigger
                  value="render"
                  className="flex items-center gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Render
                </TabsTrigger>
                <TabsTrigger
                  value="code"
                  className="flex items-center gap-2"
                >
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger
                  value="spec"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Spec
                </TabsTrigger>
              </TabsList>
              <div className="overflow-auto h-[calc(100vh-8rem)] mt-4">
                <TabsContent value="render">
                  <RenderTab liveParams={liveParams} />
                </TabsContent>
                <TabsContent value="code">
                  <CodeTab />
                </TabsContent>
                <TabsContent value="spec">
                  <SpecTab />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </LiveProvider>
    </>
  );
}
