import Router from 'koa-router';
import koa from 'koa';
import { contextCache } from './storage/cache';

const api = new Router({
  prefix: '/api',
});

api.get('/validate-token', async (ctx: koa.Context, next: () => Promise<any>) => {
  const authHeader = ctx.headers.authorization || '';
  if (!authHeader) {
    ctx.status = 400; // bad request
  } else {
    const auth = authHeader.split(' ');
    if (auth.length !== 2 || auth[0] !== 'Bearer') {
      ctx.status = 401; // no valid authentication credentials
    } else {
      const token = auth[1];
      ctx.status = contextCache.has(token) ? 204 : 403;
    }
  }
  await next();
});
export default api;
