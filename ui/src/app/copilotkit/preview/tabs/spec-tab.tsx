"use client";

import { DemoConfig, DemoConfigEditor } from "@/components/configEditor/DemoConfigEditor";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface SpecTabProps {
  initialConfig?: DemoConfig;
  onSave?: (config: DemoConfig) => void;
}

export default function SpecTab({ initialConfig, onSave }: SpecTabProps) {
  return (
    <div className="space-y-4 p-1">
      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Spec View</CardTitle>
          </div>
          <CardDescription>
            View detailed specifications and metadata
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* <div className="rounded-md bg-muted/50 border border-border h-[400px] p-4 overflow-auto">
            <div className="space-y-4 text-muted-foreground">
              <p>Asset specifications will be displayed here when an asset is selected.</p>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="font-medium">Type:</div>
                <div>-</div>
                <div className="font-medium">Dimensions:</div>
                <div>-</div>
                <div className="font-medium">Size:</div>
                <div>-</div>
                <div className="font-medium">Created:</div>
                <div>-</div>
                <div className="font-medium">Modified:</div>
                <div>-</div>
              </div>
            </div>
          </div> */}

          <DemoConfigEditor initialConfig={initialConfig} onSave={onSave} />
        </CardContent>
      </Card>
    </div>
  );
}