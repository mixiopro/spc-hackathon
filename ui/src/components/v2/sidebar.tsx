"use client";

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import AssetGrid from './asset-grid';

interface SidebarProps {
  collapsed: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ collapsed, toggleSidebar }: SidebarProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div 
      className={cn(
        "relative h-full bg-card border-r border-border transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-80"
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-border h-14">
        <div className={cn("flex items-center gap-2", collapsed && "hidden")}>
          <Layers className="h-5 w-5" />
          <h2 className="text-sm font-semibold">Assets</h2>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn(
            "rounded-full h-8 w-8",
            collapsed && "mx-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className={cn(
        "p-4 overflow-y-auto h-[calc(100%-3.5rem)]",
        collapsed && "hidden"
      )}>
        <AssetGrid />
      </div>

      {collapsed && (
        <div className="flex flex-col items-center gap-4 mt-4">
          <Layers className="h-5 w-5" />
        </div>
      )}
    </div>
  );
}