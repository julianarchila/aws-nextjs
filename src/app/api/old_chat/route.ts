import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const model = createOpenAI({
    // baseURL: "https://api.groq.com/openai/v1",
    apiKey: process.env.OpenaiApiKey,
  });

  const result = await streamText({
    // model: model("llama3-70b-8192"),
    model: model("gpt-3.5-turbo"),
    messages,
  });

  return result.toAIStreamResponse();
}
