import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid/non-secure";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const nanoid = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  7,
); // 7-character random string

// export const nanoid = () => "not-so-random-string";

export const runAsyncFnWithoutBlocking = (
  // eslint-disable-next-line
  fn: (...args: any) => Promise<any>,
) => {
  // eslint-disable-next-line
  fn();
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

import {
  BaseMessage,
  isAIMessage,
  AIMessage,
  StoredMessage,
  HumanMessage,
  ToolMessage,
  SystemMessage,
} from "@langchain/core/messages";

export const prettyPrint = (message: BaseMessage) => {
  let txt = `[${message._getType()}]: ${message.content}`;
  if (
    (isAIMessage(message) && (message as AIMessage)?.tool_calls?.length) ||
    0 > 0
  ) {
    const tool_calls = (message as AIMessage)?.tool_calls
      ?.map((tc) => `- ${tc.name}(${JSON.stringify(tc.args)})`)
      .join("\n");
    txt += ` \nTools: \n${tool_calls}`;
  }
  console.log(txt);
};

/**
 * Converts an array of `StoredMessage` objects retrieved from Redis to an array of `BaseMessage` objects.
 * This conversion is necessary for compatibility with the langchain library.
 *
 * The `type` property of each `StoredMessage` determines the corresponding `BaseMessage` subclass used for conversion:
 *   - "human": Converted to `HumanMessage` with content and additional arguments.
 *   - "ai": Converted to `AIMessage` with all data from the original message.
 *   - "tool": Converted to `ToolMessage` with all data from the original message, ensuring `tool_call_id` is a string.
 *   - Any other type: Converted to `SystemMessage` with all data from the original message.
 *
 * @param {StoredMessage[]} messages - Array of messages retrieved from Redis.
 * @returns {BaseMessage[]} - Array of converted `BaseMessage` objects.
 */
export function convertToBaseMessage(messages: StoredMessage[]): BaseMessage[] {
  let messagesToReturn: BaseMessage[] = [];

  for (const message of messages) {
    switch (message.type) {
      case "human":
        messagesToReturn.push(
          new HumanMessage(message.data.content, {
            ...message.data.additional_kwargs,
          }),
        );
        break;
      case "ai":
        messagesToReturn.push(new AIMessage({ ...message.data }));
        break;
      case "tool":
        messagesToReturn.push(
          new ToolMessage({
            ...message.data,
            tool_call_id: message.data.tool_call_id as string,
          }),
        );
        break;
      default:
        messagesToReturn.push(new SystemMessage({ ...message.data }));
    }
  }

  return messagesToReturn;
}
