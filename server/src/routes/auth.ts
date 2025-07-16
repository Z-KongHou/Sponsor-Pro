import Router from '@koa/router';
import { login, register } from './login';

const router = new Router();

router.post('/login', login);
router.post('/register', register);

export default router;
