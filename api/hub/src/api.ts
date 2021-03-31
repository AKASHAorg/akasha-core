import Router from 'koa-router';
import koa from 'koa';
import { ThreadID } from '@textile/hub';
import { getAppDB } from './helpers';

const api = new Router({
  prefix: '/api',
});
const dbId = ThreadID.fromString(process.env.AWF_THREADdb);
api.post('/validate-token/:token', async (ctx: koa.Context, next: () => Promise<any>) => {
  const invite = ctx?.params?.token;
  if (!invite) {
    ctx.status = 401;
  } else {
    const db = await getAppDB();
    const exists = await db.findByID(dbId, 'Invites', invite);
    if (exists) {
      ctx.status = exists.used ? 403 : 200;
    } else {
      ctx.status = 401;
    }
  }
  await next();
});

/*api.post('/add-token/:token', async (ctx: koa.Context, next: () => Promise<any>) => {
  const token = ctx?.params?.token;
  if (!token) {
    ctx.status = 401;
  } else {
    const db = await getAppDB();
    const id = await db.create(dbId, 'Invites', [{ _id: token, name: token, used: false }]);
    if (id.length) {
      ctx.status = 200;
    } else {
      ctx.status = 400;
    }
  }
  await next();
});*/

export default api;
