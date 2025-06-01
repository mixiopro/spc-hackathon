"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import {
  LiveError,
  LivePreview,
} from "../../../../components/revid/playground";

export default function RenderTab({
  liveParams,
}: {
  liveParams: Record<string, any>;
}) {
  const aspectRatio = 16 / 9;
  const width = 480;
  return (
    <div className="space-y-4 p-1">
      <Card className="bg-card/50 backdrop-blur-sm border-muted">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle>Render View</CardTitle>
          </div>
          <CardDescription>
            Preview the rendered output of your assets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="absolute inset-0">
            <LivePreview
              width={width}
              height={width / aspectRatio}
              variables={liveParams}
            />
          </div>
          <LiveError className="absolute bottom-0 left-0 right-0 text-red-500 p-2" />
        </CardContent>
      </Card>
    </div>
  );
}
