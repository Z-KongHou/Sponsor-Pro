FROM node:22-alpine

WORKDIR /Sponsor-Pro

COPY . .

RUN yarn config set registry https://registry.npmmirror.com
# 一次性安装所有依赖并构建
RUN yarn install && yarn cache clean && \
    npx tsc && npx tsc-alias && \
    npx prisma generate

EXPOSE 6688

CMD ["sh", "-c", "npx prisma db push && node dist/app.js"]