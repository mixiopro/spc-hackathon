/**
 * Represents an asset that can be an image, video, or audio file
 */
export interface Asset {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string; // HttpUrl equivalent
  gsUri: string;
  description?: string;
  metadata: Record<string, any>;
}

/**
 * Original Resource type
 */
export type Resource = {
  url: string;
  title: string;
  description: string;
};

/**
 * Original AgentState type
 */
export type AgentState = ReVideoAgentState;

export type OriginalAgentState = {
  model: string;
  research_question: string;
  report: string;
  resources: any[];
  logs: any[];
}

/**
 * Agent state for the ReVideo LangGraph agent.
 * Extends CopilotKitState which provides chat history (messages).
 */
export interface ReVideoAgentState {
  assets: Asset[];
  starter_code?: string;
  prompt: string;
  planner_result: Record<string, any>;
  final_result?: {
    code? : string
  };
}