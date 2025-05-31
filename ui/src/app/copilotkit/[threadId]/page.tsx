"use client";

import PlaygroundRenderer from "@/components/revid";
import { initialState } from "@/constants/initial.state";
import { AgentState } from "@/data/interfaces/coagent.interface";
import {
  useCoAgent,
  useCopilotAction,
  useCopilotContext,
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useEffect, useState } from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../../components/ui/breadcrumb";
import { Separator } from "../../../components/ui/separator";
import { SidebarTrigger } from "../../../components/ui/sidebar";

export default function CopilotKitPage({
  params,
}: {
  params: { threadId: string };
}) {
  const { threadId, setThreadId } = useCopilotContext();
  const [themeColor, setThemeColor] = useState("#6366f1");

  useEffect(() => {
    setThreadId(params.threadId);
  }, [params.threadId]);

  // 🪁 Frontend Actions: https://docs.copilotkit.ai/guides/frontend-actions
  useCopilotAction({
    name: "setThemeColor",
    parameters: [
      {
        name: "themeColor",
        description: "The theme color to set. Make sure to pick nice colors.",
        required: true,
      },
    ],
    handler({ themeColor }) {
      setThemeColor(themeColor);
      // alert(themeColor);
    },
  });

  return (
    <section>
      <YourMainContent themeColor={themeColor} />
      <CopilotSidebar
        clickOutsideToClose={false}
        defaultOpen={true}
        shortcut="/"
        labels={{
          title: "Popup Assistant",
          initial:
            '👋 Hi, there! You\'re chatting with an agent. This agent comes with a few tools to get you started.\n\nFor example you can try:\n- **Frontend Tools**: "Set the theme to orange"\n- **Shared State**: "Write a proverb about AI"\n- **Generative UI**: "Get the weather in SF"\n\nAs you interact with the agent, you\'ll see the UI update in real-time to reflect the agent\'s **state**, **tool calls**, and **progress**.',
        }}
      />
    </section>
  );
}

// State of the agent, make sure this aligns with your agent's state.

function YourMainContent({ themeColor }: { themeColor: string }) {
  // 🪁 Shared State: https://docs.copilotkit.ai/coagents/shared-state
  const { state, setState } = useCoAgent<AgentState>({
    name: "sample_agent",
    initialState: {
      starterCode: "",
      plannerResult: {},
      finalResult: {},
      ...initialState
    },
  });


  useEffect(() => {
    console.log("state updated", state);
  }, [state]);
  //🪁 Generative UI: https://docs.copilotkit.ai/coagents/generative-ui
  // useCopilotAction({
  //   name: "getWeather",
  //   description: "Get the weather for a given location.",
  //   available: "disabled",
  //   parameters: [{ name: "location", type: "string", required: true }],
  //   render: ({ args }) => {
  //     return <WeatherCard location={args.location} themeColor={themeColor} />;
  //   },
  // });

  return (
    <div className="h-screen">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        {/* <SidebarTrigger className="cursor-pointer" /> */}
        {/* <Separator orientation="vertical" className="mr-2 h-4" /> */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Planner</h1>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage className="">
                  {"Content Planner"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div
        // This div centers the content block below the header.
        // Added flex-col, items-center for centering, overflow-y-auto for scrolling, and padding.
        // className="h-[calc(100vh-70px)] w-full flex flex-col items-center overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors duration-300"
      >
        <div
          // This is the main content block, styled to be white with shadow and rounded corners.
          // Increased max-width to allow for more cards per row.
          // Removed bg-white and shadow-xl, reduced padding from p-6 sm:p-8 to p-4.
          className="rounded-2xl w-full max-w-7xl"
        >

          <PlaygroundRenderer />
        </div>
      </div>
    </div>
  );
}

