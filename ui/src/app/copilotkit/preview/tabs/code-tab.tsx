"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Code } from "lucide-react";

export default function CodeTab() {
  return (
    <div className="space-y-4 p-1">
      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-primary" />
            <CardTitle>Code View</CardTitle>
          </div>
          <CardDescription>
            Examine and edit code related to the selected asset
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-muted/50 border border-border h-[400px] p-4 font-mono text-sm overflow-auto">
            <pre className="text-muted-foreground">
              {`// Code related to the selected asset will appear here
// Select an asset from the sidebar to view its code

function renderAsset(asset) {
  // Implementation will be added later
  return asset;
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}