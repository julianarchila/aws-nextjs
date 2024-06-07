import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Resource } from "sst";

// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();
  const model = createOpenAI({
    baseUrl: "https://api.together.xyz/v1",
    apiKey: process.env.OpenaiApiKey,
  });

  const result = await streamText({
    model: model("meta-llama/Llama-3-70b-chat-hf"),
    messages,
  });

  return result.toAIStreamResponse();
}
