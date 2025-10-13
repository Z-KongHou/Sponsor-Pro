import jwt, { SignOptions } from 'jsonwebtoken';

const JWT_SECRET = 'misaki_secret_key';
const JWT_EXPIRES_IN = '1h';

export interface JwtPayload {
    openid: string;
    session_key: string;
}

export const generateToken = (payload: JwtPayload): string => {
    const options: SignOptions = {
        expiresIn: JWT_EXPIRES_IN as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
        return decoded;
    } catch (error) {
        return null;
    }
};
