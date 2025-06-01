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
    <AppLayout />
  );
}

