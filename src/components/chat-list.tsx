import { type UIState } from "@/lib/chat/types";
import { Separator } from "@/components/ui/separator";

export interface ChatList {
  messages: UIState;
  isShared: boolean;
}

export default function ChatList({ messages }: ChatList) {
  if (!messages.length) {
    return null;
  }

  // filter messages that have spinner, display and attachments as null at the same time

  messages = messages.filter((message) => {
    return message.spinner || message.display || message.attachments;
  });

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      {messages.map((message, index) => (
        <div key={message.id}>
          {message.spinner}
          {message.display}
          {message.attachments}
          {index < messages.length - 1 && <Separator className="my-4" />}
        </div>
      ))}
    </div>
  );
}
