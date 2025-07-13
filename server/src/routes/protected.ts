import Router from '@koa/router';
import { Context } from 'koa';
import { JWTMiddleware } from '../middleWare/JWTMiddleWare';

const router = new Router();

// 受保护的路由示例 - 需要 JWT 认证
router.get('/profile', JWTMiddleware, async (ctx: Context & { user?: any }) => {
    try {
        const userId = ctx.user?.id;
        
        // 这里应该从数据库获取用户详细信息
        const user = await ctx.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, createdAt: true }
        });

        ctx.status = 200;
        ctx.body = {
            code: 200,
            data: {
                user: ctx.user,
                message: 'This is a protected route'
            },
            message: 'Profile retrieved successfully',
        };
    } catch (error) {
        console.error('Profile error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            data: null,
            message: 'Internal server error',
        };
    }
});

// 测试路由 - 检查 JWT token 是否有效
router.get('/verify', JWTMiddleware, async (ctx: Context & { user?: any }) => {
    ctx.status = 200;
    ctx.body = {
        code: 200,
        data: { user: ctx.user },
        message: 'Token is valid',
    };
});

export default router;
