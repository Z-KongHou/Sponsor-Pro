import Router from "@koa/router";
import testFunction from "../../controller/DemoController";

const router = new Router();

router.get("/test", testFunction);

export default router;
