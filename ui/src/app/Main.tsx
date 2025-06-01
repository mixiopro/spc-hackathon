import { AgentState } from "@/lib/types";
import { useCoAgent } from "@copilotkit/react-core";
import { CopilotChat, useCopilotChatSuggestions } from "@copilotkit/react-ui";
import PlaygroundRenderer from "../components/revid";
import { initialState } from "../constants/initial.state";

export default function Main() {
  const { state, setState } = useCoAgent<AgentState>({
    name: "sample_agent",
    initialState: {
      starterCode: "",
      plannerResult: {},
      finalResult: {},
      ...initialState
    },
  });

  useCopilotChatSuggestions({
    instructions: "Lifespan of penguins",
  });

  return (
    <>
      <h1 className="flex h-[60px] bg-[#0E103D] text-white items-center px-10 text-2xl font-medium">
        Research Helper
      </h1>

      <div
        className="flex flex-1 border"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <div className="flex-1 overflow-hidden">
          {/* <ResearchCanvas /> */}
          <PlaygroundRenderer />
        </div>
        <div
          className="w-[500px] h-full flex-shrink-0 border-l"
          style={
            {
              // "--copilot-kit-background-color": "#E0E9FD",
              // "--copilot-kit-secondary-color": "#6766FC",
              // "--copilot-kit-separator-color": "#b8b8b8",
              // "--copilot-kit-primary-color": "#FFFFFF",
              // "--copilot-kit-contrast-color": "#000000",
              // "--copilot-kit-secondary-contrast-color": "#000",
            } as any
          }
        >
          <CopilotChat
            className="h-full"
            onSubmitMessage={async (message) => {
              console.log("🚀 ---------------------🚀");
              console.log("🚀 ~CopilotChat message:", message);
              console.log("🚀 ~CopilotChat state:", {
                ...state,
                prompt: message,
                plannerResult: {},
                finalResult: {},
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
            labels={{
              initial: "Hi! How can I assist you with your research today?",
            }}
          />
        </div>
      </div>
    </>
  );
}
