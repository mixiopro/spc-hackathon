import { useCoAgent } from '@copilotkit/react-core';
import React from 'react';
import { AgentState } from '../../lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface AssetPaneProps {
  className?: string;
}

export const AssetPane: React.FC<AssetPaneProps> = ({ className }) => {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });

  return (
    <div className={`flex flex-col h-full bg-background text-foreground ${className}`}>
      {/* Heading */}
      <h1 className="text-xl font-semibold p-4 border-b border-border">
        Assets {state?.assets?.length ? `(${state.assets.length})` : ''}
      </h1>

      {/* Asset List */}
      <div className="flex-1 overflow-y-auto">
        {!state?.assets?.length && (
          <p className="text-muted-foreground p-4">No assets available.</p>
        )}
        
        {/* Group assets by type */}
        {['video', 'image', 'audio'].map(type => {
          const typeAssets = state?.assets?.filter(asset => asset.type === type) || [];
          if (!typeAssets.length) return null;
          
          return (
            <section key={type} className="p-4 border-b border-border">
              <h2 className="text-lg font-medium mb-3 text-muted-foreground capitalize">
                {type}s ({typeAssets.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {typeAssets.map(asset => (

                  <div>
                     {asset.type === 'video' && (
                        <video
                          className="w-full max-w-full max-h-[200px] rounded-md object-contain"
                          controls
                          src={asset.url}
                        >
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {asset.type === 'image' && (
                        <img
                          className="w-full max-w-full max-h-[200px] rounded-md object-contain"
                          src={asset.url}
                          alt={asset.description || 'Image asset'}
                        />
                      )}
                      {asset.type === 'audio' && (
                        <audio
                          className="w-full max-w-full"
                          controls
                          src={asset.url}
                        >
                          Your browser does not support the audio tag.
                        </audio>
                      )}
                  </div>
                  // <Card key={asset.id} className=''>
                  //   {/* <CardHeader className="">
                  //     <CardTitle className="text-xs truncate">
                  //       {asset.description || 'Untitled Asset'}
                  //     </CardTitle>
                  //     <CardDescription className="truncate text-xs">
                  //       {asset.url}
                  //     </CardDescription>
                  //   </CardHeader> */}
                  //   <CardContent className="">
                  //     {asset.type === 'video' && (
                  //       <video
                  //         className="w-full max-w-full max-h-[200px] rounded-md object-contain"
                  //         controls
                  //         src={asset.url}
                  //       >
                  //         Your browser does not support the video tag.
                  //       </video>
                  //     )}
                  //     {asset.type === 'image' && (
                  //       <img
                  //         className="w-full max-w-full max-h-[200px] rounded-md object-contain"
                  //         src={asset.url}
                  //         alt={asset.description || 'Image asset'}
                  //       />
                  //     )}
                  //     {asset.type === 'audio' && (
                  //       <audio
                  //         className="w-full max-w-full"
                  //         controls
                  //         src={asset.url}
                  //       >
                  //         Your browser does not support the audio tag.
                  //       </audio>
                  //     )}
                  //   </CardContent>
                  // </Card>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default AssetPane;