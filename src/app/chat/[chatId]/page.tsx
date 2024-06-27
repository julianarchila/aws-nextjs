import { getChat } from "@/controllers/chat";
import { AI } from "@/lib/chat/actions";
import { redirect } from "next/navigation";

import { Chat } from "@/components/chat/Chat";

export interface ChatPageProps {
  params: {
    chatId: string;
  };
}

export default async function Page({ params }: ChatPageProps) {
  const chat = await getChat(params.chatId);
  if (!chat) {
    redirect("/");
  }

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat id={chat.id} />
    </AI>
  );
}
