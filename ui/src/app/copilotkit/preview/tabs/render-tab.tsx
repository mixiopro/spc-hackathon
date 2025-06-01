"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye } from "lucide-react";

export default function RenderTab() {
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
          <div className="rounded-md bg-muted/50 border border-border h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">Selected asset will render here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}