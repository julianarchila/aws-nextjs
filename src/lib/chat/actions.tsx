import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getAIState,
  getMutableAIState,
} from "ai/rsc";
import { BotMessage, SpinnerMessage, UserMessage } from "@/components/message";
import type { AIState, UIState } from "./types";
import { nanoid } from "@/lib/utils";
import { handleSubmitUserMessage } from "./handlers";

// eslint-disable-next-line
async function submitUserMessage(content: string): Promise<UIState[number]> {
  "use server";

  // Get the current state of the AI
  const aiState = getMutableAIState<typeof AI>();
  console.log("chatId", aiState.get().chatId);

  // Stream objects
  const textStream = createStreamableValue("");
  const spinnerStream = createStreamableUI(<SpinnerMessage />);
  const messageStream = createStreamableUI(null);
  const uiStream = createStreamableUI();

  handleSubmitUserMessage({
    content,
    aiState,
    textStream,
    spinnerStream,
    messageStream,
    uiStream,
  })
    .then(() => {
      // Close streams
      spinnerStream.done();
      messageStream.done();
      textStream.done();
      uiStream.done();

      aiState.done(aiState.get());
    })
    .catch((error) => {
      console.error(error);
      spinnerStream.done();
      messageStream.done();
      textStream.done();
      uiStream.done();
    });

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
