import { type createStreamableUI } from "ai/rsc";
import type OpenAI from "openai";

import type { BaseMessage, StoredMessage } from "@langchain/core/messages";

/* type FunctionCall = {
  role: "function";
  name: string;
  arguments?: Record<string, any>;
  output?: Record<string, any>;
}; */

// export type Message = OpenAI.Beta.Threads.Message | FunctionCall;
/* export type ToolOutput =
OpenAI.Beta.Threads.Runs.RunSubmitToolOutputsParams.ToolOutput; */
export type Message = BaseMessage;

export interface AIState {
  chatId: string;
  messages: StoredMessage[];
}

export interface AgentState {
  chatId: string;
  messages: BaseMessage[];
}

export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

export type StremableUI = ReturnType<typeof createStreamableUI>;

type ValueOrUpdater<T> = T | ((current: T) => T);
type _MutableAIState<AIState> = {
  get: () => AIState;
  update: (newState: ValueOrUpdater<AgentState>) => void;
  done: ((newState: AIState) => void) | (() => void);
};

export type MutableAIState = _MutableAIState<AgentState>;

export interface GenerateToolsOptions {
  storeId: number;
  uiStream: StremableUI;
  messageStream: StremableUI;
  aiState: MutableAIState;
}

export interface Chat extends Record<string, any> {
  id: string;
  messages: StoredMessage[];
  // title: string;
  createdAt: Date;
  userId?: string;
  path: string;
}
