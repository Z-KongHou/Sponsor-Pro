import Koa from "koa";
import Router from "@koa/router";
import cors from "@koa/cors";
import logger from "koa-logger";
import bodyParser from "koa-bodyparser";
import routes from "./routes";
import prisma from "./prisma";
import { responseMiddleware } from "./middleWare/responseMiddleWare";

const app = new Koa();
const router = new Router();

router.get("/", async (ctx) => {
  ctx.body = "Hello World!";
});

// 应用中间件
app.use(async (ctx, next) => {
  ctx.prisma = prisma;
  await next();
});

app.use(logger());
app.use(cors());
app.use(responseMiddleware);
app.use(bodyParser());
app.use(routes.routes());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(process.env.PORT || 6677, () => {
  console.log(`Server running on : ${process.env.PORT || 6677}`);
});
