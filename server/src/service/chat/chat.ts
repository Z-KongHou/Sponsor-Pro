import { initialize } from "./init";
import { sub,redis } from "@/cache/redis";
import { saveChatMessage,getChatHistory,CheckChat } from "@/cache/cache";

const userSockets = new Map();

export function chatWithWs(socket, req) {
    userSockets.set(req.openId, socket.id);
    initialize(socket, req.openId, req.server.prisma);
    sub.on('message', (channel, message) => {
        const sessionId = channel.split(":")[2];
        const message1 = JSON.parse(message);
      // 推送给在线用户
        const targetSocket = userSockets.get(message1.to);
        if (targetSocket) {
            socket.to(targetSocket).emit("new_message", message1);
        }
    })
    socket.on('message', async (msg) => {
        const { from, to, sessionId, content } = msg;
        const message = {
            time: Date.now(),
            to: to,
            content: content,
        };
        const exists = await CheckChat(sessionId);
        if (!exists) {
            try {
            await req.server.prisma.session.create({
                data: {
                session_id: sessionId,
                participants: {
                    connect: [
                    { id: parseInt(from, 10) },
                    { id: parseInt(to, 10) },
                    ],
                },
                },
            });
            } catch (e) {
            if (e.code === 'P2002') {
                console.log('Session already exists.');
            } else {
                throw e;
            }
            }
        }
        // 保存消息到 Redis
        await saveChatMessage(sessionId, message);
        await redis.publish(`chat:session:${sessionId}:pubsub`, JSON.stringify(message));


    })

    socket.on("open_chat",async (msg) => {
        const { from, to, sessionId, content } = msg;
        const history = await getChatHistory(sessionId, 50, from);
        socket.emit("chat_history", history);
    })


    socket.on('disconnect', () => {
        userSockets.delete(req.openId);
    });
    socket.on('close', () => {
        userSockets.delete(req.openId);
    });

}