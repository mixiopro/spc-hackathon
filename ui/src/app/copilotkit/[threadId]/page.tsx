"use client";

import { initialState } from "@/constants/initial.state";
import { AgentState } from "@/data/interfaces/coagent.interface";
import {
  useCoAgent,
  useCopilotAction,
  useCopilotContext,
} from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useEffect, useState } from "react";
import AppLayout from "../../../components/v2/app-layout";

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
          title: "Video Assistant",
          initial:
            `👋 Hey there! You're chatting with your AI-powered video editor. This editor comes with smart tools to help you get started.

Here are a few things you can try:

Visual Styling: “Set the video theme to cinematic”

Smart Edits: “Trim awkward pauses and add background music”

As you interact, you’ll see your timeline and edits update in real-time—showing the editor’s state, actions, and progress as it works with you.`,
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
    <AppLayout />
  );
}

