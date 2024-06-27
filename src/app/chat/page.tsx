import { AI } from "@/lib/chat/actions";
// import { getMissingKeys } from '../actions'
// import { auth } from "@clerk/nextjs";
import { Chat } from "@/components/chat/Chat";
import { nanoid } from "@/lib/utils";
import { headers } from "next/headers";

export const metadata = {
  title: "Dialu AI Chatbot",
};

// export const runtime = "edge";

export interface PageProps { }

export default async function Page(props: PageProps) {
  headers();
  const id = nanoid();

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} />
    </AI>
  );
}
