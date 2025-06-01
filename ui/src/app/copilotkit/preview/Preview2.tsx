"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Monitor, Code, FileText } from "lucide-react"
import RenderTab from "./tabs/render-tab"
import CodeTab from "./tabs/code-tab"
import SpecTab from "./tabs/spec-tab"

// @deprecated
export function Preview2() {
  return (
    <div className="flex flex-col h-full bg-background">
      <div className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Tabs defaultValue="render" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-transparent border-0 h-14 p-1">
            <TabsTrigger
              value="render"
              className="flex items-center gap-2 data-[state=active]:bg-background/80 data-[state=active]:shadow-sm"
            >
              <Monitor className="h-4 w-4" />
              Render
            </TabsTrigger>
            <TabsTrigger
              value="code"
              className="flex items-center gap-2 data-[state=active]:bg-background/80 data-[state=active]:shadow-sm"
            >
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
            <TabsTrigger
              value="spec"
              className="flex items-center gap-2 data-[state=active]:bg-background/80 data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              Spec
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6">
            <TabsContent value="render" className="mt-0 h-full">
              <RenderTab />
            </TabsContent>
            <TabsContent value="code" className="mt-0 h-full">
              <CodeTab />
            </TabsContent>
            <TabsContent value="spec" className="mt-0 h-full">
              <SpecTab />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
