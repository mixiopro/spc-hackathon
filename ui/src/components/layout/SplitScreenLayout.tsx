import React from 'react';
import AssetPane from './AssetPane';
import ContentPane from './ContentPane';
import { Preview } from '../../app/copilotkit/preview/Preview';
import { Preview2 } from '../../app/copilotkit/preview/Preview2';

interface SplitScreenLayoutProps {
  children?: React.ReactNode;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = () => {
  return (
    <div className="flex w-full h-screen bg-background">
      {/* Left Pane - 40% width */}
      <div className="w-[30%] h-full">
        <AssetPane />
      </div>

      {/* Right Pane - 60% width */}
      <div className="w-[70%] h-full">
        <Preview2 />
      </div>
    </div>
  );
};

export default SplitScreenLayout;