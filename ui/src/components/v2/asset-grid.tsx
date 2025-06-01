"use client";

import { Card } from "@/components/ui/card";
import { useCoAgent } from "@copilotkit/react-core";
import { Image, Music, Video } from "lucide-react";
import { AgentState, Asset } from "../../lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

const getIconForType = (type: Asset['type']) => {
  switch (type) {
    case 'image':
      return Image;
    case 'video':
      return Video;
    case 'audio':
      return Music;
    default:
      return Image;
  }
};

export default function AssetGrid() {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAssetClick = (asset: Asset) => {
    if (asset.type === 'audio' || asset.type === 'video') {
      setSelectedAsset(asset);
      setIsDialogOpen(true);
    }
  };

  return (
    <>
    <div className="grid grid-cols-2 gap-3">
      {state.assets?.map((asset) => {
        const Icon = getIconForType(asset.type);
        
        return (
          <Card
            key={asset.id}
            className="group relative p-4 hover:bg-accent transition-colors cursor-pointer flex flex-col items-center justify-center aspect-square"
            onClick={() => handleAssetClick(asset)}
          >
            <div className="mb-2 p-2 rounded-full bg-background/40 backdrop-blur-sm">
              <Icon className="h-6 w-6" />
            </div>
            <p className="text-xs text-center font-medium truncate w-full">
              {asset.description || asset.id}
            </p>
          </Card>
        );
      })}
    </div>

    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {selectedAsset?.description || selectedAsset?.id}
          </DialogTitle>
        </DialogHeader>
        {selectedAsset?.type === 'audio' && (
          <audio controls className="w-full">
            <source src={selectedAsset.url} />
            Your browser does not support the audio element.
          </audio>
        )}
        {selectedAsset?.type === 'video' && (
          <video controls className="w-full">
            <source src={selectedAsset.url} />
            Your browser does not support the video element.
          </video>
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}