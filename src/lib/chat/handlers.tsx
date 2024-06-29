import { ChatGenerationChunk } from "@langchain/core/outputs";
import { AIMessageChunk, HumanMessage } from "@langchain/core/messages";
import { graph } from "./agent";
import { getConvertedChat } from "@/controllers/chat";
import { BotMessage, SpinnerMessage } from "@/components/message";

import type { MutableAIState, StremableUI, StremableValue } from "./types";

interface SubmitUserMessageParams {
  content: string;
  aiState: MutableAIState;
  textStream: StremableValue<string>;
  spinnerStream: StremableUI;
  messageStream: StremableUI;
  uiStream: StremableUI;
}

export async function handleSubmitUserMessage(params: SubmitUserMessageParams) {
  const {
    content,
    aiState,
    textStream,
    spinnerStream,
    messageStream,
    uiStream,
  } = params;

  // Configuration object for langgraph
  const config = {
    configurable: {
      id: aiState.get().chatId,
    },
  };

  // Start spinner
  spinnerStream.update(<SpinnerMessage />);
  let started = false;

  // get chat history from a redis store
  const saved_chat = await getConvertedChat(config.configurable.id);

  // If no saved chat, start with a new chat (empty array)
  const messages = saved_chat?.messages ?? [];

  // append the user message to the list
  const inputs = {
    messages: [...messages, new HumanMessage(content)],
  };

  // run the graph and iterate over the stream
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
}
