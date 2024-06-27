"use server";

import { type Chat } from "@/lib/chat/types";
import { redis } from "@/lib/redis";

import { convertToBaseMessage } from "@/lib/utils";

export async function saveChat(chat: Chat) {
  await redis.hmset(`chat:${chat.id}`, chat);
}

export async function getChat(id: string) {
  return await redis.hgetall<Chat>("chat:" + id);
}

export async function getConvertedChat(id: string) {
  const chat = await getChat(id);
  if (!chat) {
    return null;
  }
  const messages = convertToBaseMessage(chat.messages);

  return {
    ...chat,
    messages,
  };
}
