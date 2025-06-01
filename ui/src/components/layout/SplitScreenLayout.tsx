import React from 'react';
import AssetPane from './AssetPane';
import ContentPane from './ContentPane';
import { Preview } from '../../app/copilotkit/preview/Preview';

interface SplitScreenLayoutProps {
  children?: React.ReactNode;
}

export const SplitScreenLayout: React.FC<SplitScreenLayoutProps> = () => {
  return (
    <div className="flex w-full h-screen">
      {/* Left Pane - 40% width */}
      <div className="w-[30%] h-full">
        <AssetPane />
      </div>

      {/* Right Pane - 60% width */}
      <div className="w-[70%] h-full">
        <Preview />
      </div>
    </div>
  );
};

export default SplitScreenLayout;