import { redis } from "./redis";

const chatHistoryLimit = 100;
const HOUR = 60 * 60;           // 一小时的秒数
const chatHistoryExpire = 1200 * HOUR;

interface Message {
  time: number;
  content: string;
  to: string;
}

/**
 * 保存聊天消息到 Redis（按 chatID 分组）
 */
export async function saveChatMessage(chatID: string, message: Message) {
  const key = `chat:history:${chatID}`;
  const unreadkey = `chat:unread:${chatID}`
  const Lastkey = `chat:last`
  const jsonData = JSON.stringify(message);

  try {
    const result = await redis.multi()
      .rpush(key, jsonData)
      .ltrim(key, -chatHistoryLimit, -1)
      .expire(key, chatHistoryExpire)
      .exec();

    if (!result) {
      console.error('Redis transaction failed');
    }
    await redis.hincrby(unreadkey, message.to, 1);
    await redis.hset(Lastkey, chatID, jsonData);
  } catch (err) {
    console.error("❌ 保存聊天消息失败:", err);
  }
}


export async function getChatHistory(chatID: string, limit: number, usrId: string): Promise<Message[]> {
  const key = `chat:history:${chatID}`;
  const unreadkey = `chat:unread:${chatID}`
  const messages: Message[] = [];

  try {
    const results = await redis.lrange(key, 0, limit - 1);
    await redis.hdel(unreadkey, usrId);
    for (const result of results) {
      try {
        const message: Message = JSON.parse(result);
        messages.push(message);
      } catch (err) {
        console.error("解析聊天记录失败:", err);
        continue;
      }
    }
  } catch (err) {
    console.error("获取聊天记录失败:", err);
  }

  return messages;
}

export async function getChatInfo(chatID: string, usrId: string) {
  const unreadKey = `chat:unread:${chatID}`
  const lastKey = `chat:last`

  // 获取未读数
  const unreadStr = await redis.hget(unreadKey, usrId)
  const unread = unreadStr ? parseInt(unreadStr, 10) : 0

  // 获取最后一条消息
  const lastMessageStr = await redis.hget(lastKey, chatID)
  const lastMessage = lastMessageStr ? JSON.parse(lastMessageStr) as Message : null

  return {
    unread,
    lastMessage: lastMessage
      ? { time: lastMessage.time, content: lastMessage.content }
      : { time: null, content: null },
  }
}

export async function CheckChat(chatID: string) {
  const key = `chat:history:${chatID}`;
  const exists = await redis.exists(key);
  return exists;
}