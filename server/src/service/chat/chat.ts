import { sub,redis } from "@/cache/redis";
import { saveChatMessage,getChatHistory,getChatInfo } from "@/cache/cache";

const userSockets = new Map();
const subscribedChannels = new Set();

const Handler = {
    "openChat": open_chat,
    "init": initialize,
    "chat": chat
}

sub.on('message', (channel, message) => {
    const sessionId = channel.split(":")[2];
    const message1 = JSON.parse(message);
      // 推送给在线用户
    const targetSocket = userSockets.get(message1.to);
     if (targetSocket) {
        targetSocket.send(JSON.stringify({eventType: "chat",data:message1}));
    }
})

export function chatWithWs(socket, req) {
    userSockets.set(req.openId, socket);
    console.log(`用户 ${req.openId} 已连接 WebSocket`);
    socket.on('message', async (msg) => {
        const message = JSON.parse(msg);
        const { eventType } = message.content
        Handler[eventType](socket, req, message);
    })

    socket.on('disconnect', () => {
        userSockets.delete(req.openId);
    });
    socket.on('close', () => {
        userSockets.delete(req.openId);
    });

}

async function open_chat (socket, req, msg) {
    const chatID = req.openId;
    const from = req.server.prisma.user.findUnique({
        where: { open_id: chatID },
        select: { id: true },
    });
    const { to, sessionId, content } = msg.content;
    const history = await getChatHistory(sessionId, 50, from.id);
    socket.send(JSON.stringify({eventType: "openChat" ,data:history}));
}

async function chat(socket,req ,msg) {
    const { from, to, sessionId, content } = msg.content;
    const message = {
        time: Date.now(),
        to: to,
        content: content,
    };
        // 保存消息到 Redis
    await saveChatMessage(sessionId, message);
    await redis.publish(`chat:session:${sessionId}:pubsub`, JSON.stringify(message));
}


async function initialize(socket, req, message) {
  const { prisma } = req.server;
  const userWithSessions = await prisma.user.findUnique({
    where: { open_id: req.openId },
    include: { sessions: { select: { session_id: true , participants: { select: { id: true, name: true, avatarurl: true } } } } }
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
            // 正确比较participant的id与用户id
            const otherParticipant = session.participants.find(
              (participant) => participant.id.toString() !== userWithSessions.id.toString()
            );
            const chatInfo = await getChatInfo(session.session_id, userWithSessions.id.toString());
            // 检查是否已订阅该频道
            if (!subscribedChannels.has(`chat:session:${session.session_id}:pubsub`)) {
              sub.subscribe(`chat:session:${session.session_id}:pubsub`);
              subscribedChannels.add(`chat:session:${session.session_id}:pubsub`);
            }
            // 合并原始会话数据和聊天信息
            return {
              id: otherParticipant.id,
              name: otherParticipant.name,
              avatar: otherParticipant.avatarurl,
              sessionId: session.session_id,
              unreadCount: chatInfo.unread,
              lastMessage: chatInfo.lastMessage?.content || '',
              lastTime: chatInfo.lastMessage?.time || null
            };
          } catch (error) {
            console.error(`获取会话 ${session.session_id} 的聊天信息失败:`, error);
            return {
              id: '',
              name: '未知用户',
              avatar: '',
              sessionId: session.session_id,
              unreadCount: 0,
              lastMessage: '',
              lastTime: null
            };
          }
        })
      );

      sessions = enhancedSessions;
      
      console.log('增强后的会话列表:', sessions);

      socket.send(JSON.stringify({
        eventType: 'init',
        data: sessions
      }));
    } catch (error) {
      console.error('处理会话列表时发生错误:', error);
    }
  }
}