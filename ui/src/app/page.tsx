"use client";

import { CopilotKit } from "@copilotkit/react-core";
import Main from "./Main";
import {
  ModelSelectorProvider,
  useModelSelectorContext,
} from "@/lib/model-selector-provider";
import { ModelSelector } from "@/components/ModelSelector";

export default function ModelSelectorWrapper() {
  return (
    <ModelSelectorProvider>
      <Home />
      <ModelSelector />
    </ModelSelectorProvider>
  );
}

const runtimeUrl = process.env.NEXT_PUBLIC_COPILOTKIT_RUNTIME_URL;
// When using Copilot Cloud, all we need is the publicApiKey.
const publicApiKey = process.env.NEXT_PUBLIC_COPILOT_API_KEY;
// The name of the agent that we'll be using.
const agentName = process.env.NEXT_PUBLIC_COPILOTKIT_AGENT_NAME

function Home() {

  // // This logic is implemented to demonstrate multi-agent frameworks in this demo project.
  // // There are cleaner ways to handle this in a production environment.
  // const runtimeUrl = lgcDeploymentUrl
  //   ? `/api/copilotkit?lgcDeploymentUrl=${lgcDeploymentUrl}`
  //   : `/api/copilotkit${
  //       agent.includes("crewai") ? "?coAgentsModel=crewai" : ""
  //     }`;

  return (
      <CopilotKit
          runtimeUrl={runtimeUrl}
          publicApiKey={publicApiKey}
          agent={agentName}
        >
      <Main />
        </CopilotKit>
  );
}
