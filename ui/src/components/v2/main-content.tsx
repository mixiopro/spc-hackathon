"use client";

import { defaultConfig, DemoConfig, DemoConfigEditor } from "@/components/configEditor/DemoConfigEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useCoAgent } from "@copilotkit/react-core";
import { Code, FileText, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import CodeTab from "../../app/copilotkit/preview/tabs/code-tab";
import RenderTab from "../../app/copilotkit/preview/tabs/render-tab";
import { AgentState } from "../../lib/types";
import { LiveProvider } from "../revid/playground";
export interface FormState {
    config: DemoConfig;
    code: string;
  }

export default function MainContent() {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });
  

  const form = useForm<FormState>({
    defaultValues: {
      config: defaultConfig,
      code: ""
    },
    mode: "onChange"
  });

  const [formState, setFormState] = useState<FormState>({
    config: defaultConfig,
    code: ""
  });

  // Watch all form changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('🚀 Form data changed:', value);
      const currentValues = form.getValues();
      console.log('🚀 Current form state:', currentValues);
      if (currentValues) {
        setFormState(currentValues);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Initialize form with complete config
  useEffect(() => {
    console.log('🚀 Initializing form with complete config...');
    form.reset({
      config: defaultConfig,
      code: ""
    });
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
        code={formState.code || ""}
        autoCompile={true}
        parameters={{config: formState.config}}
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
