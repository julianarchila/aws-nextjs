import { ChatOpenAI } from "@langchain/openai";
import { toolNode, tools } from "./tools";
import { nanoid } from "../utils";
import { Resource } from "sst";

/* const model = new ChatOpenAI({
  apiKey: Resource.OpenaiApiKey.value,
  temperature: 0,
  modelName: "llama3-70b-8192",
  configuration: {
    baseURL: "https://api.groq.com/openai/v1",
  },
}); */

const model = new ChatOpenAI({
  apiKey: Resource.OpenaiApiKey.value,
  model: "gpt-4o",
});

// This formats the tools as json schema for the model API.
// The model then uses this like a system prompt.
export const boundModel = model.bindTools(tools);

// DEFINE THE AGENT STATE
import type { StateGraphArgs } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export const agentState: StateGraphArgs<AgentState>["channels"] = {
  messages: {
    value: (x: BaseMessage[], y: BaseMessage[]) => x.concat(y),
    default: () => [],
  },
  chatId: {
    reducer: (x) => x,
    default: () => nanoid(),
  },
};

// DEFINE THE NODES
import type { RunnableConfig } from "@langchain/core/runnables";
import { AIMessage } from "@langchain/core/messages";

// Define the function that determines whether to continue or not
const shouldContinue = (state: AgentState) => {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1] as AIMessage;
  /* messages.forEach((message) => {
    prettyPrint(message);
  }); */
  // If the LLM makes a tool call, then we route to the "tools" node
  if (lastMessage.additional_kwargs.tool_calls) {
    return "tools";
  }
  // Otherwise, we stop (reply to the user)
  return "final";
};

// Define the function that calls the model
const callModel = async (state: AgentState, config?: RunnableConfig) => {
  const messages = state.messages;
  const response = await boundModel.invoke(messages, config);
  /* console.log("response", {
    ...response,
    additional_kwargs: { ...response.additional_kwargs },
  }); */
  // We return an object, because this will get added to the existing list
  return { messages: [response] };
};

const finalNode = async (state: AgentState, config?: RunnableConfig) => {
  const id = config?.configurable?.id;
  if (!id) {
    throw new Error("No chat id provided in configurable");
  }
  const chat: Chat = {
    messages: state.messages.map((m) => m.toDict()),
    id: id,
    createdAt: new Date(),
    path: "/chat/" + id,
  };

  console.log("[agent.ts | finalNode] Saving chat...");
  await saveChat(chat);

  return {};
};

// DEFINE THE GRAPH

import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { AgentState, Chat } from "./types";
import { saveChat } from "@/controllers/chat";

// Initialize memory to persist state between graph runs
const checkpointer = new MemorySaver();

// Define a new graph
const workflow = new StateGraph({ channels: agentState })
  // Define the two nodes we will cycle between
  .addNode("agent", callModel)

  // Note the "action" and "final" nodes are identical!
  .addNode("tools", toolNode)
  .addNode("final", finalNode)
  // Set the entrypoint as `agent`
  .addEdge(START, "agent")
  // We now add a conditional edge
  .addConditionalEdges(
    // First, we define the start node. We use `agent`.
    "agent",
    // Next, we pass in the function that will determine which node is called next.
    shouldContinue,
  )
  // We now add a normal edge from `tools` to `agent`.
  .addEdge("tools", "agent")
  .addEdge("final", END);

// Finally, we compile it!
export const graph = workflow.compile({
  // checkpointer,
});
