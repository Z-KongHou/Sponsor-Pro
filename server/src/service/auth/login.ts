import { Context } from 'koa';
import { generateToken,verifyToken } from '../../utils/jwt';
import { teacher,clubmember,enterprise,open_id } from './util';
import axios from 'axios';
const appsecret="ebfc0bc082398a087deafe171f87690f";

const login = async (ctx: Context) => {
    try {
        const data = ctx.request.body as open_id;
        if (!data.code || !data.appcode) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message: 'miss code',
            };
            return;
        }
        const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${data.appcode}&secret=${appsecret}&js_code=${data.code}&grant_type=authorization_code`
        const response = await axios.get(url);
        const { openid, session_key } = response.data;
        console.log('openid:', openid); // 用户唯一标识
        console.log('session_key:', session_key); // 用于解密敏感数据
        if (!openid || !session_key) {
            ctx.status = 400;
            ctx.body = {
                code: 400,
                message:'登录失败',
            };
            return;
        }
        const token = generateToken({ openid, session_key });

        ctx.body = {
            code: 200,
            token: token,
            message: '登录成功',
        }
        const user = await ctx.prisma.user.findUnique({
            where: { open_id: openid }
        });
        if (!user) {
            ctx.body={
                code: 206,
                token: token,
                message: '用户不存在',
            }
        }
    }catch (error) {
        console.error('微信接口调用失败:', error.response.data);
        throw new Error('登录失败');
    }
}

const register = async (ctx :Context) => {
    try {
        const userData = ctx.request.body as (teacher | clubmember | enterprise);
        const token = ctx.headers.authorization.split(' ')[1];
        if (!token) {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                data: null,
                message: '需要先登录微信',
            };
            return;
        }
        const openid = verifyToken(token).openid;

        const existingUser = await ctx.prisma.user.findUnique({
            where: { open_id: openid }
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
                open_id: openid,
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