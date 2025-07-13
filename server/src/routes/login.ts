import bcrypt from 'bcrypt';
import { Context } from 'koa';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';

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
        const { name, email, password } = ctx.request.body as { 
            name: string; 
            email: string; 
            password: string; 
        };
        if (!name || !email || !password) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                data: null,
                message: 'Name, email and password are required',
            };
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                data: null,
                message: 'Invalid email format',
            };
            return;
        }

        const existingUser = await ctx.prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                data: null,
                message: 'Email already exists',
            };
            return;
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await ctx.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        ctx.status = 201;
        ctx.body = {
            code: 201,
            data: { id: newUser.id, email: newUser.email, name: newUser.name },
            message: 'Registration successful',
        };
    } catch (error) {
        console.error('Registration error:', error);
        ctx.status = 500;
        ctx.body = {
            code: 500,
            data: null,
            message: 'Internal server error',
        };
    }
}

export { login, register };