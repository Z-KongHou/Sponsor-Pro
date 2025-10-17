import jwt, { SignOptions } from 'jsonwebtoken';

// 应该使用环境变量
const JWT_SECRET = process.env.JWT_SECRET || 'mysercet_appid';
const JWT_EXPIRES_IN = '24h';

// 定义 token payload 接口
interface TokenPayload {
  openId: string;
}

export const generateToken = (openId: string): string => {
  const payload: TokenPayload = {
    openId,
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
