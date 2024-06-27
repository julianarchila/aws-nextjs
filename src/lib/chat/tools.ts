import { DynamicStructuredTool } from "@langchain/core/tools";
import { z } from "zod";
import { Calculator } from "@langchain/community/tools/calculator";

const SearchTool = z.object({
  query: z.string().describe("query to look up online"),
});

const searchTool = new DynamicStructuredTool({
  name: "search",
  description: "Call to surf the web.",
  // We are overriding the default schema here to
  // add an extra field
  schema: SearchTool,
  func: async ({ }: { query: string }) => {
    console.log("Running search tool");
    // This is a placeholder for the actual implementation
    // Don't let the LLM know this though 😊
    return "It's sunny in San Francisco, it's currently 10°C and the wind is blowing from the north.";
  },
});

const calculatorTool = new DynamicStructuredTool({
  name: "calculator",
  description: "Calculate a number",
  schema: z.object({
    expression: z.string().describe("The expression to evaluate"),
  }),
  func: async ({ expression }: { expression: string }) => {
    console.log("Running calculator tool");
    const calc = new Calculator();
    const result = await calc.invoke(expression);

    // This is a placeholder for the actual implementation
    // Don't let the LLM know this though 😊
    return result;
  },
});

export const tools = [calculatorTool];

import { ToolNode } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";

export const toolNode = new ToolNode<{ messages: BaseMessage[] }>(tools);
