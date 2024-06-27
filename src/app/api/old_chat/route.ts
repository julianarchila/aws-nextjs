import { createOpenAI } from "@ai-sdk/openai";
import { streamText } from "ai";
import { Resource } from "sst";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const model = createOpenAI({
    // baseURL: "https://api.groq.com/openai/v1",
    apiKey: Resource.OpenaiApiKey.value,
  });

  const result = await streamText({
    // model: model("llama3-70b-8192"),
    model: model("gpt-3.5-turbo"),
    messages,
  });

  return result.toAIStreamResponse();
}
