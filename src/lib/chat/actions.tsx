// import { OpenAI } from "openai";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";
import { BotMessage, SpinnerMessage, UserMessage } from "@/components/message";
import type { AIState, UIState } from "./types";
import { convertToBaseMessage, nanoid } from "@/lib/utils";

import { graph } from "./agent";
import { ChatGenerationChunk } from "@langchain/core/outputs";
import { AIMessageChunk, HumanMessage } from "@langchain/core/messages";

// eslint-disable-next-line
async function submitUserMessage(content: string): Promise<UIState[number]> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // get chat history from a redis store

  aiState.update((state) => {
    return {
      ...state,
      messages: [...state.messages, new HumanMessage(content).toDict()],
    };
  });

  const textStream = createStreamableValue("");
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  console.log("chatId", aiState.get().chatId);

  const inputs = {
    messages: convertToBaseMessage(aiState.get().messages),
  };
  const config = {
    configurable: {
      id: aiState.get().chatId,
    },
  };

  void (async () => {
    spinnerStream.update(<SpinnerMessage />);
    let started = false;

    for await (const event of await graph.streamEvents(inputs, {
      ...config,
      streamMode: "values",
      version: "v1",
    })) {
      if (event.event === "on_llm_start") {
        // console.log("on_llm_start");
      }

      if (event.event === "on_llm_stream") {
        if (!started) {
          started = true;
          spinnerStream.update(null);
          messageStream.update(<BotMessage content={textStream.value} />);
        }

        let chunk: ChatGenerationChunk = event.data?.chunk;
        let msg = chunk.message as AIMessageChunk;
        if (msg.tool_call_chunks && msg.tool_call_chunks.length > 0) {
          // console.log(msg.tool_call_chunks);
        } else {
          if (typeof msg.content == "string") {
            textStream.update(msg.content);
          }
        }
      }
    }

    spinnerStream.done();
    messageStream.done();
    textStream.done();
    uiStream.done();

    aiState.done(aiState.get());
  })();

  return {
    id: nanoid(),
    attachments: uiStream.value,
    spinner: spinnerStream.value,
    display: messageStream.value,
  };
}

export type AIActions = {
  submitUserMessage: typeof submitUserMessage;
};

const actions: AIActions = {
  submitUserMessage,
};

export const AI = createAI<AIState, UIState, AIActions>({
  actions,
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  // eslint-disable-next-line
  onGetUIState: async () => {
    "use server";
    const aiState = getAIState<typeof AI>();

    const uiState = getUIStateFromAIState(aiState);
    return uiState;
  },
});

export type AI = typeof AI;

export const getUIStateFromAIState = (aiState: AIState) => {
  return aiState.messages.map((message, index) => ({
    id: `${aiState.chatId}-${index}`,
    display:
      message.type === "tool" ? null : message.type === "human" ? (
        <UserMessage key={nanoid()}> {message.data.content} </UserMessage>
      ) : message.type === "ai" && message.data.content !== "" ? (
        <BotMessage content={message.data.content} />
      ) : null,
  }));
};
