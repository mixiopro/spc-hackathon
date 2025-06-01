import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";
import ReactMarkdown from "react-markdown";

export default function PlanTab() {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });

  console.log('🚀 -----------------🚀')
  console.log('🚀 ~ state.planner_result:', state.planner_result)
  console.log('🚀 -----------------🚀')


  return (
    <div className="relative p-4 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{state.planner_result.plan || ''}</ReactMarkdown>
      </div>
    </div>
  );
}