import bcrypt from 'bcrypt';
import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';
import { teacher,clubmember,enterprise } from './util';

interface ExtendedContext extends Context {
    prisma: PrismaClient;
}

const login = async (ctx: ExtendedContext) => {
    try {
        const { email, password } = ctx.request.body as { email: string; password: string };
        
        if (!email || !password) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                data: null,
                message: 'Email and password are required',
            };
            return;
        }

        const user = await ctx.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                data: null,
                message: 'Unauthorized: Invalid email or password',
            };
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                data: null,
                message: 'Unauthorized: Invalid email or password',
            };
            return;
        }

        const token = generateToken({ id: user.id, email: user.email });

        ctx.status = 200;
        ctx.body = {
            code: 200,
            data: { token, user: { id: user.id, email: user.email, name: user.name } },
            message: 'Login successful',
        };
    } catch (error) {
        console.error('Login error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            data: null,
            message: 'Internal server error',
        };
    }
}

const register = async (ctx: ExtendedContext) => {
    try {
        const userData = ctx.request.body as (teacher | clubmember | enterprise);
        
        if (!userData.open_id) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                data: null,
                message: '需要先登录微信',
            };
            return;
        }

        const existingUser = await ctx.prisma.user.findUnique({
            where: { open_id: userData.open_id }
        });

        if (existingUser) {
            ctx.status = 409;
            ctx.body = {
                code: 409,
                data: null,
                message: '用户已存在'
            };
            return;
        }

        const user = await ctx.prisma.user.create({
            data: {
                open_id: userData.open_id,
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                role: userData.role
            }
        });

        if (userData.role === 'teacher') {
            const teacherData = userData as teacher;
            await ctx.prisma.teacher.create({
                data: {
                    userId: user.id,
                    subject: teacherData.subject,
                    department: teacherData.department,
                    school: teacherData.school
                }
            });
        } else if (userData.role === 'club') {
            const clubData = userData as clubmember;
            await ctx.prisma.clubMember.create({
                data: {
                    userId: user.id,
                    clubName: clubData.clubName,
                    school: clubData.school,
                    description: clubData.description,
                    category: clubData.category
                }
            });
        } else if(userData.role === 'enterprise') {
            const enterpriseData = userData as enterprise;
            await ctx.prisma.companyMember.create({
                data: {
                    userId: user.id,
                    companyName: enterpriseData.companyName,
                    industry: enterpriseData.industry,
                    description: enterpriseData.description
                }
            });
        }
        ctx.body = {
            code: 200,
            message: 'success'
        }
    }
    catch (error) {
        console.error('Registration error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            data: null,
            message: '异常错误',
        };
    }
}

export { login, register };