import React from "react";

export const TabContentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-[85vh] w-[85%] flex-col overflow-hidden border-2">
      <div className="flex-1 overflow-auto p-4">
        {children}
      </div>
    </div>
  );
};