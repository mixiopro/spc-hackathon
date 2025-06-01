"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCoAgent } from "@copilotkit/react-core";
import { Code, FileText, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { DemoConfig, defaultConfig, DemoConfigEditor } from "@/components/configEditor/DemoConfigEditor";
import { toast } from "@/hooks/use-toast";
import CodeTab from "../../app/copilotkit/preview/tabs/code-tab";
import RenderTab from "../../app/copilotkit/preview/tabs/render-tab";
import { AgentState } from "../../lib/types";
import { LiveProvider } from "../revid/playground";

export default function MainContent() {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });
  const form = useForm<DemoConfig>({
    defaultValues: defaultConfig,
    mode: "onChange"
  });

  // Initialize state with full config
  const [formState, setFormState] = useState<DemoConfig>(defaultConfig);

  // Watch all form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('🚀 Form data changed:', value);
      const currentValues = form.getValues();
      console.log('🚀 Current form state:', currentValues);
      setFormState(currentValues);
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Initialize form with complete config
  useEffect(() => {
    console.log('🚀 Initializing form with complete config...');
    form.reset(defaultConfig);
  }, [form]);

  const handleFormSubmit = (data: DemoConfig) => {
    console.log('Saving configuration from MainContent:', data);
    toast({
      title: "Configuration Saved (from MainContent)",
      description: "Your demo configuration has been successfully updated.",
    });
  };

  // Fixed aspect ratio and width matching PlaygroundRenderer
  const aspectRatio = 16 / 9;
  const width = 480;

  return (
    <>
      <LiveProvider
        code={state.final_result?.code || ""}
        autoCompile={true}
        parameters={{config: formState}}
        width={width}
        aspectRatio={aspectRatio}
      >
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border">
            <Tabs defaultValue="render" className="w-full">
              <TabsList className="grid w-full grid-cols-3 border-0 p-1">
                <TabsTrigger value="render" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Render
                </TabsTrigger>
                <TabsTrigger value="code" className="flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="spec" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Spec
                </TabsTrigger>
              </TabsList>
              <div className="overflow-auto h-[calc(100vh-8rem)] mt-4">
                <TabsContent value="render">
                  <RenderTab liveParams={formState} />
                </TabsContent>
                <TabsContent value="code">
                  <CodeTab />
                </TabsContent>
                <TabsContent value="spec">
                  <DemoConfigEditor
                    initialConfig={defaultConfig}
                    form={form}
                    onSave={handleFormSubmit}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </LiveProvider>
    </>
  );
}
