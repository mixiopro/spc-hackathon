"use client";

import { Card } from "@/components/ui/card";
import { Image, FileText, Music, Video, FileImage, File } from "lucide-react";

// Sample asset data
const assets = [
  { id: 1, type: 'image', name: 'Hero Image', icon: Image },
  { id: 2, type: 'document', name: 'Specifications', icon: FileText },
  { id: 3, type: 'audio', name: 'Background Music', icon: Music },
  { id: 4, type: 'video', name: 'Intro Video', icon: Video },
  { id: 5, type: 'image', name: 'Logo Design', icon: FileImage },
  { id: 6, type: 'image', name: 'Background Pattern', icon: FileImage },
  { id: 7, type: 'document', name: 'User Guide', icon: File },
  { id: 8, type: 'video', name: 'Tutorial', icon: Video },
];

export default function AssetGrid() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {assets.map((asset) => {
        const Icon = asset.icon;
        
        return (
          <Card 
            key={asset.id} 
            className="group relative p-4 hover:bg-accent transition-colors cursor-pointer flex flex-col items-center justify-center aspect-square"
          >
            <div className="mb-2 p-2 rounded-full bg-background/40 backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-xs text-center font-medium truncate w-full">
              {asset.name}
            </p>
          </Card>
        );
      })}
    </div>
  );
}