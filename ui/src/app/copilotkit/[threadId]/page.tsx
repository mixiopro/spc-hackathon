"use client";

import { initialState } from "@/constants/initial.state";
import { AgentState } from "@/data/interfaces/coagent.interface";
import { useCoAgent, useCopilotContext } from "@copilotkit/react-core";
import { CopilotSidebar } from "@copilotkit/react-ui";
import { useEffect, useState } from "react";
import AppLayout from "../../../components/v2/app-layout";

export default function CopilotKitPage({
  params,
}: {
  params: { threadId: string };
}) {
  const { threadId, setThreadId } = useCopilotContext();

  const { state, setState } = useCoAgent<AgentState>({
    name: "sample_agent",
    initialState: {
      starterCode: "",
      planner_result: {},
      final_result: {},
      ...initialState,
    },
  });

  useEffect(() => {
    console.log("state updated", state);
  }, [state]);

  useEffect(() => {
    setThreadId(params.threadId);
  }, [params.threadId]);

  return (
    <section>
      <AppLayout />
      <CopilotSidebar
        clickOutsideToClose={false}
        onSubmitMessage={async (message) => {
          console.log("🚀 ---------------------🚀");
          console.log("🚀 ~CopilotKitPage message:", message);
          console.log("🚀 ~CopilotKitPage state:", {
            ...state,
            prompt: message,
            planner_result: {},
            final_result: {},
          });
          console.log("🚀 ---------------------🚀");
          // Reset the state before starting new research
          setState({
            ...state,
            prompt: message,
            planner_result: {},
            final_result: {},
          });
          await new Promise((resolve) => setTimeout(resolve, 30));
        }}
        defaultOpen={true}
        shortcut="/"
        labels={{
          title: "Video Assistant",
          initial: `👋 Hey there! You're chatting with your AI-powered video editor. This editor comes with smart tools to help you get started.

Here are a few things you can try:

Visual Styling: “Set the video theme to cinematic”

Smart Edits: “Trim awkward pauses and add background music”

As you interact, you’ll see your timeline and edits update in real-time—showing the editor’s state, actions, and progress as it works with you.`,
        }}
      />
    </section>
  );
}

