import type { createStreamableValue, createStreamableUI } from "ai/rsc";

import type { BaseMessage, StoredMessage } from "@langchain/core/messages";

export type Message = BaseMessage;

/** The state of the AI for vercel ai sdk helper */
export interface AIState {
  chatId: string;
  messages: StoredMessage[];
}
/** The state of the UI for vercel ai sdk helper */
export type UIState = {
  id: string;
  display: React.ReactNode;
  spinner?: React.ReactNode;
  attachments?: React.ReactNode;
}[];

// Type helpers for ai sdk
export type StremableUI = ReturnType<typeof createStreamableUI>;
export type StremableValue<T> = ReturnType<typeof createStreamableValue<T>>;

type ValueOrUpdater<T> = T | ((current: T) => T);
type _MutableAIState<_AIState> = {
  get: () => _AIState;
  update: (newState: ValueOrUpdater<_AIState>) => void;
  done: ((newState: _AIState) => void) | (() => void);
};

export type MutableAIState = _MutableAIState<AIState>;

/** The state of the langgraph agent*/
export interface AgentState {
  chatId: string;
  messages: BaseMessage[];
}

export interface GenerateToolsOptions {
  storeId: number;
  uiStream: StremableUI;
  messageStream: StremableUI;
  aiState: MutableAIState;
}

/** The chat object (this is the same as the redis store) */
export interface Chat extends Record<string, any> {
  id: string;
  messages: StoredMessage[];
  // title: string;
  createdAt: Date;
  userId?: string;
  path: string;
}
