import { useCoAgent } from "@copilotkit/react-core";
import { AgentState } from "@/lib/types";
import ReactMarkdown from "react-markdown";

export default function PlanTab() {
  const { state } = useCoAgent<AgentState>({ name: "sample_agent" });

  console.log("🚀 -----------------🚀");
  console.log("🚀 ~ state.planner_result:", state.planner_result);
  console.log("🚀 -----------------🚀");

  return (
    <div className="relative p-6 rounded-md bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border">
      <div className="prose prose-invert prose-headings:text-primary prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-accent-foreground prose-code:bg-accent/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-ul:text-muted-foreground prose-ol:text-muted-foreground prose-li:marker:text-muted-foreground/60 max-w-none space-y-4">
        <ReactMarkdown>
          {state?.planner_result?.plan || "No plan available"}
        </ReactMarkdown>
      </div>
    </div>
  );
}
