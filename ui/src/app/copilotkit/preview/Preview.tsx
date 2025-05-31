'use client';

import { LiveEditor, LiveError, LivePreview, LiveProvider, LiveRun } from "@/components/revid/playground";
import { ParameterEditor } from "@/components/ui/parameter-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoAgent } from "@copilotkit/react-core";
import { useState } from "react";
import { AgentState } from "../../../lib/types";

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
  name: 'world',
  color: '#42b883',
};

export function Preview() {
    const { state } = useCoAgent<AgentState>({name:"sample_agent"});  

  console.log('🚀 -----------------🚀')
  console.log('🚀 ~Preview state:', state)
  console.log('🚀 -----------------🚀')
  const [liveParams, setLiveParams] = useState<Record<string, any>>(defaultParams);
  
  // Fixed aspect ratio and width matching PlaygroundRenderer
  const aspectRatio = 16 / 9;
  const width = 480;

  // Handler for parameter changes
  const handleParameterChange = (newParams: Record<string, any>) => {
    setLiveParams(newParams);
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <LiveProvider
        code={state.final_result?.code || ""}
        autoCompile={true}
        parameters={liveParams}
        width={width}
        aspectRatio={aspectRatio}
      >
        <Tabs defaultValue="render">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <LiveRun />
          </div>
          
          <TabsContent value="render" className="relative aspect-video">
            <LivePreview width={width} height={width / aspectRatio} variables={liveParams} />
            <LiveError className="absolute bottom-0 left-0 right-0 text-red-500 p-2" />
          </TabsContent>
          
          <TabsContent value="code">
            <div className="h-[500px] overflow-auto">
              <LiveEditor className="w-full h-full font-mono text-sm" />
            </div>
          </TabsContent>
          
          <TabsContent value="spec">
            <ParameterEditor
              parameters={liveParams}
              onParameterChange={handleParameterChange}
            />
          </TabsContent>
        </Tabs>
      </LiveProvider>
    </div>
  );
}
