import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import webSockify from 'koa-websocket';
import cors from '@koa/cors';
import { ApolloServer } from 'apollo-server-koa';
import typeDefs from './schema';

import dotenv from 'dotenv';
dotenv.config();

import wss from './wss';
import api, { promRegistry } from './api';
import ProfileAPI from './datasources/profile';
import { contextCache, redisCache } from './storage/cache';
import TagAPI from './datasources/tag';
import PostAPI from './datasources/post';
import CommentAPI from './datasources/comment';
import { ThreadID } from '@textile/hub';
import query from './resolvers/query';
import mutations from './resolvers/mutations';
import { setupDBCollections } from './helpers';
import { utils } from 'ethers';
import createMetricsPlugin from './plugins/metrics';

if (!process.env.USER_GROUP_API_KEY || !process.env.USER_GROUP_API_SECRET) {
  // tslint:disable-next-line:no-console
  console.log('no env keys');
  process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10) || 3113;

const wsOptions = {};
const app = webSockify(new Koa(), wsOptions);

/** Middlewares */
app.use(json());
app.use(logger());
app.use(
  bodyParser({
    onerror: function (err, ctx) {
      ctx.throw('body parse error', err);
    },
  }),
);

const enabledDomains = JSON.parse(process.env.ALLOWED_ORIGINS);
app.use(
  cors({
    origin: ctx => {
      if (enabledDomains.indexOf(ctx.request.header.origin) !== -1) {
        return ctx.request.header.origin;
      }
      return enabledDomains[0];
    },
  }),
);

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

app.use(api.routes());
app.use(api.allowedMethods());

app.ws.use(wss);

let dbID;
if (process.env.AWF_THREADdb) {
  dbID = ThreadID.fromString(process.env.AWF_THREADdb);
}

(async () => setupDBCollections())();

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: query,
    Mutation: mutations,
  },
  cache: redisCache,
  dataSources: () => ({
    profileAPI: new ProfileAPI({ dbID, collection: 'Profiles' }),
    tagsAPI: new TagAPI({ dbID, collection: 'Tags' }),
    postsAPI: new PostAPI({ dbID, collection: 'Posts' }),
    commentsAPI: new CommentAPI({ dbID, collection: 'Comments' }),
  }),
  // access Koa context
  context: ({ ctx }) => {
    const header = ctx.headers.authorization || '';
    const signature = ctx.headers.signature || undefined;
    let user;
    if (header) {
      const auth = header.split(' ');
      if (auth.length === 2 && auth[0] === 'Bearer') {
        user = contextCache.get(utils.id(auth[1]));
      }
    }
    return { user, signature };
  },
  plugins: [createMetricsPlugin(promRegistry)],
});

server.applyMiddleware({ app });
/** Start the server! */
// tslint:disable-next-line:no-console
app.listen(PORT, () => {
  // tslint:disable-next-line:no-console
  console.log(`graphql ready at http://localhost:${PORT}${server.graphqlPath}`);
});
