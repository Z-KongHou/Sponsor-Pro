import { sub,redis } from "@/cache/redis";
import { saveChatMessage,getChatHistory,getChatInfo } from "@/cache/cache";

const userSockets = new Map();
const subscribedChannels = new Set();

const Handler = {
    "openChat": open_chat,
    "init": initialize,
    "chat": chat,
    "ping": ping
}

sub.on('message', (channel, message) => {
    const sessionId = channel.split(":")[2];
    const message1 = JSON.parse(message);
    const targetSocket = userSockets.get(message1.to);
     if (targetSocket) {
        targetSocket.send(JSON.stringify({eventType: "chat",data:{ sessionId: sessionId, message: message1}}));
    }
})

export function chatWithWs(socket, req) {
    console.log(`用户 ${req.openId} 已连接 WebSocket`);
    socket.on('message', async (msg) => {
        const message = JSON.parse(msg);
        if (!Handler[message.content.eventType]) {
            console.error(`未知的事件类型: ${message.content.eventType}`);
            return;
        }
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
    const from = await req.server.prisma.user.findUnique({
        where: { open_id: chatID },
        select: { id: true },
    });
    try { 
      const history = await getChatHistory(msg.sessionId, 50, from.id.toString());
      socket.send(JSON.stringify({eventType: "openChat" ,data:{ sessionId: msg.sessionId, messages: history}}));
    } catch (error) {
        console.error('获取历史记录失败:', error);
    }
}

async function chat(socket,req ,msg) {
    const { from, to, sessionId, content , name , avatar} = msg.content.data;

    const message = {
        time: Date.now(),
        to: to,
        content: content,
        from: from,
        name: name,
        avatar: avatar
    };
        // 保存消息到 Redis
    try {
        await saveChatMessage(sessionId, message);
        await redis.publish(`chat:session:${to}:pubsub`, JSON.stringify(message));
    } catch (error) {
        console.error('❌ 保存或发布聊天消息失败:', error);
    }
    console.log(`用户 ${from} 发送消息到 ${to}: ${content}`);
}


async function initialize(socket, req, message) {
  const { prisma } = req.server;
  const userWithSessions = await prisma.user.findUnique({
  where: { open_id: req.openId },
    select: { 
      id: true,
      sessions: { 
        select: { 
            session_id: true,
            participants: { 
              select: { 
                id: true, 
                name: true, 
                avatarurl: true 
              } 
            }
        } 
      } 
    }
  });
  if (!userWithSessions) {
    throw new Error('用户不存在');
  }

  userSockets.set(userWithSessions.id, socket);
  if (!subscribedChannels.has(`chat:session:${userWithSessions.id}:pubsub`)) {
    sub.subscribe(`chat:session:${userWithSessions.id}:pubsub`);
    subscribedChannels.add(`chat:session:${userWithSessions.id}:pubsub`);
  }
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

function ping(socket, req, msg) {
  socket.send(JSON.stringify({eventType: "pong"}));
}