"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CodeTab from "../../app/copilotkit/preview/tabs/code-tab";
import RenderTab from "../../app/copilotkit/preview/tabs/render-tab";
import SpecTab from "../../app/copilotkit/preview/tabs/spec-tab";


export default function MainContent() {
  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <div className="p-4 border-b border-border">
        <Tabs defaultValue="render" className="w-full">
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="render">Render</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="spec">Spec</TabsTrigger>
          </TabsList>
          <div className="overflow-auto h-[calc(100vh-8rem)] mt-4">
            <TabsContent value="render">
              <RenderTab />
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
  );
}