"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Code } from "lucide-react";
import { LiveEditor } from "../../../../components/revid/playground";

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
          <LiveEditor className="w-full h-full font-mono text-sm" />
        </CardContent>
      </Card>
    </div>
  );
}
