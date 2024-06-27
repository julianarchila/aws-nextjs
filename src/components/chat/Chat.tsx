"use client";
// import { useLocalStorage } from "@/lib/hooks/use-local-storage";
import { useUIState, useAIState } from "ai/rsc";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { AI } from "@/lib/chat/actions";
import type { Message } from "@/lib/chat/types";
// import { type auth } from "@clerk/nextjs";

import ChatList from "@/components/chat-list";
import { EmptyScreen } from "@/components/empty-screen";
import { cn } from "@/lib/utils";
import { ChatPanel } from "@/components/chat-pannel";

export interface ChatProps extends React.ComponentProps<"div"> {
  initialMessages?: Message[];
  id?: string;
  // storeId: number;
  // session?: ReturnType<typeof auth>["session"];
  // missingKeys: string[];
}

export function Chat({ id, className }: ChatProps) {
  const router = useRouter();
  const path = usePathname();
  const [input, setInput] = useState("");
  const [messages] = useUIState<typeof AI>();
  const [aiState] = useAIState<typeof AI>();

  /* const [_, setNewChatId] = useLocalStorage("newChatId", id);
  useEffect(() => {
    setNewChatId(id);
  }); */

  useEffect(() => {
    // if messages.length is 1 and the path looks like /chat
    // then redirect to /chat/:chatId

    if (messages.length === 1 && path === `/chat`) {
      window.history.replaceState(null, "", `/chat/${id}`);
    }
  }, [id, path, messages]);

  useEffect(() => {
    const messagesLength = aiState.messages?.length;
    if (messagesLength === 2) {
      router.refresh();
    }
  }, [aiState.messages, router]);

  return (
    <div className="group w-full overflow-auto pl-0 peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]">
      <div className={cn("pb-[200px] pt-4 md:pt-10", className)}>
        {messages.length ? (
          <ChatList messages={messages} isShared={false} />
        ) : (
          <EmptyScreen />
        )}
        <div className="h-px w-full" />
      </div>
      <ChatPanel id={id} input={input} setInput={setInput} />
    </div>
  );
}
