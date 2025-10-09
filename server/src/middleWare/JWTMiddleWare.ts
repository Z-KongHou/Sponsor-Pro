import { Context, Next } from 'koa';
import { verifyToken, JwtPayload } from '../utils/jwt';

interface AuthContext extends Context {
    user?: JwtPayload;
}

export const JWTMiddleware = async (ctx: AuthContext, next: Next) => {
    const authHeader = ctx.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        ctx.status = 401;
        ctx.body = {
            code: 401,
            data: null,
            message: 'Unauthorized: No token provided',
        };
        return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    if (!decoded) {
        ctx.status = 401;
        ctx.body = {
            code: 401,
            data: null,
            message: 'Unauthorized: Invalid token',
        };
        return;
    }

    // 将用户信息添加到 context 中
    ctx.user = decoded;
    await next();
};

// 可选的 JWT 中间件 - 不强制要求 token
export const optionalJWTMiddleware = async (ctx: AuthContext, next: Next) => {
    const authHeader = ctx.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);
        if (decoded) {
            ctx.user = decoded;
        }
    }
    
    await next();
};