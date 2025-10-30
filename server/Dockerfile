# 使用更具体的版本，避免自动更新导致的问题
FROM node:22-alpine AS builder

WORKDIR /Sponsor-Pro

COPY . .

# 安装所有依赖（包括开发依赖）以确保构建成功
RUN yarn install --frozen-lockfile && yarn cache clean

# 先运行tsc编译TypeScript，然后运行tsc-alias处理路径别名
RUN npx tsc && npx tsc-alias

# 使用更小的运行时镜像
FROM node:22-alpine AS runtime

WORKDIR /Sponsor-Pro

COPY --from=builder /Sponsor-Pro/dist ./dist
COPY --from=builder /Sponsor-Pro/prisma ./prisma
COPY package.json .

# 在运行时阶段只安装生产依赖
RUN yarn install --frozen-lockfile --production && yarn cache clean
RUN npx prisma generate

EXPOSE 6688

CMD ["sh", "-c", "npx prisma db push && node dist/app.js"]