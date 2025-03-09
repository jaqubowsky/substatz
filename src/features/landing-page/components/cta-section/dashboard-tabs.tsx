"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface TabContent {
  name: string;
  content: React.ReactNode;
}

interface DashboardTabsProps {
  tabs: TabContent[];
}

export const DashboardTabs = ({ tabs }: DashboardTabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <>
      <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row sm:space-x-1 space-y-2 sm:space-y-0 rounded-lg">
        {tabs.map((tab, index) => (
          <div className="flex-1 bg-white rounded-lg" key={index}>
            <Button
              onClick={() => setActiveTab(index)}
              variant={activeTab === index ? "default" : "outline"}
              className="w-full text-xs sm:text-sm md:text-base"
              aria-selected={activeTab === index}
              role="tab"
              aria-controls={`tab-panel-${index}`}
              id={`tab-${index}`}
            >
              {tab.name}
            </Button>
          </div>
        ))}
      </div>

      <div className="relative w-full overflow-hidden">
        {tabs.map((tab, index) => (
          <div
            key={index}
            id={`tab-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`tab-${index}`}
            className={cn(
              "transition-all",
              activeTab === index ? "opacity-100 block" : "opacity-0 hidden"
            )}
            tabIndex={activeTab === index ? 0 : -1}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </>
  );
};
