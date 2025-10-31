import { PrismaClient } from "@prisma/client";
import { getChatInfo } from "@/cache/cache";
import { sub } from "@/cache/redis";

export async function initialize(socket, openId: string, prisma: PrismaClient) {
  const userWithSessions = await prisma.user.findUnique({
    where: { open_id: openId },
    include: {
      sessions: true, // 会拿到该用户关联的所有 session
    },
  });

  let sessions = userWithSessions?.sessions ?? [];

  // 遍历sessions并为每个session添加未读状态和最后一条消息
  if (sessions.length > 0) {
    try {
      // 并发处理所有会话，提高效率
      const enhancedSessions = await Promise.all(
        sessions.map(async (session) => {

          try {
            // 获取聊天信息
            const chatInfo = await getChatInfo(session.session_id, userWithSessions.id.toString());
            sub.subscribe(`chat:session:${session.session_id}:pubsub`);
            // 合并原始会话数据和聊天信息
            return {
              ...session,
              unread: chatInfo.unread,
              lastMessage: chatInfo.lastMessage
            };
          } catch (error) {
            console.error(`获取会话 ${session.session_id} 的聊天信息失败:`, error);
            // 出错时返回原始会话，不中断流程
            return {
              ...session,
              unread: 0,
              lastMessage: { time: null, content: null }
            };
          }
        })
      );

      sessions = enhancedSessions;
      
      console.log('增强后的会话列表:', sessions);

      socket.send(JSON.stringify({
        type: 'sessions_info',
        data: sessions
      }));
    } catch (error) {
      console.error('处理会话列表时发生错误:', error);
    }
  }
}