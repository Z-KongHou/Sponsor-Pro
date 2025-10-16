import axios from 'axios';

interface TokenData {
  token: string;
  endTime: number;
}

class AccessToken implements TokenData {
  token: string = "";
  endTime: number = 0;
  
  constructor() {
    this.endTime = Date.now();
  }
  
  async refreshToken(): Promise<void> {
    try {
      const res = await axios.get(
        `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${process.env.APPID}&secret=${process.env.APPSECRET}`
      );
      if (res.data.errcode) {
        throw new Error(`WeChat API error: ${res.data.errmsg}`);
      }
      this.token = res.data.access_token;
      // 提前60秒刷新，确保token不会过期
      this.endTime = Date.now() + (res.data.expires_in - 60) * 1000;
      
    } catch (error) {
      console.error("Refresh token failed:", error);
      throw error;
    }
  }
  
  // 添加检查token是否过期的方法
  isExpired(): boolean {
    return Date.now() >= this.endTime;
  }
  
  // 添加获取token的方法，如果过期则自动刷新
  async getToken(): Promise<string> {
    if (this.isExpired() || !this.token) {
      await this.refreshToken();
    }
    return this.token;
  }
}

export default new AccessToken();
