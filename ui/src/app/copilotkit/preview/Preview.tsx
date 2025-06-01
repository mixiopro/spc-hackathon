"use client";

import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  LiveRun,
} from "@/components/revid/playground";
import { ParameterEditor } from "@/components/ui/parameter-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoAgent } from "@copilotkit/react-core";
import { TabContentWrapper } from "./components/TabContentWrapper";
import { useState } from "react";
import { AgentState } from "../../../lib/types";
import { Card } from "../../../components/ui/card";

const tabs = [
  {
    value: "render",
    label: "Render",
  },
  {
    value: "code",
    label: "Code",
  },
  {
    value: "spec",
    label: "Spec",
  },
];

// Default parameters matching PlaygroundRenderer
const defaultParams = {
  name: "world",
  color: "#42b883",
};

export function Preview() {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });

  console.log("🚀 -----------------🚀");
  console.log("🚀 ~Preview state:", state);
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
    <div className="flex h-full flex-col bg-background text-foreground">
      <LiveProvider
        code={state.final_result?.code || ""}
        autoCompile={true}
        parameters={liveParams}
        width={width}
        aspectRatio={aspectRatio}
      >
        <Tabs defaultValue="render" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="w-full bg-card/30 p-0 h-10 border-b border-border/20">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="px-4 min-w-[80px] data-[state=active]:bg-accent/40 data-[state=active]:text-accent-foreground/90 text-muted-foreground hover:text-foreground/80 transition-colors"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="render" className="flex-1 bg-background">
            <TabContentWrapper>
              <Card className="relative border-border/20 bg-card/30">
                <div className="absolute inset-0">
                  <LivePreview
                    width={width}
                    height={width / aspectRatio}
                    variables={liveParams}
                  />
                </div>
                <LiveError className="absolute bottom-0 left-0 right-0 text-red-500 p-2" />
              </Card>
            </TabContentWrapper>
          </TabsContent>

          <TabsContent value="code">
            <TabContentWrapper>
              <Card className="border-border/20 bg-card/30">
                <LiveEditor className="w-full h-full font-mono text-sm" />
              </Card>
            </TabContentWrapper>
          </TabsContent>

          <TabsContent value="spec">
            <TabContentWrapper>
              <Card className="border-border/20 bg-card/30">
                <ParameterEditor
                  parameters={liveParams}
                  onParameterChange={handleParameterChange}
                />
              </Card>
            </TabContentWrapper>
          </TabsContent>
        </Tabs>
      </LiveProvider>
    </div>
  );
}
