import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import json from 'koa-json';
import bodyParser from 'koa-bodyparser';
import webSockify from 'koa-websocket';
import cors from '@koa/cors';
import { ApolloServer } from 'apollo-server-koa';
import helmet from 'koa-helmet';
import typeDefs from './schema';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';

import dotenv from 'dotenv';
dotenv.config();

import wss from './wss';
import api, { promRegistry } from './api';
import { contextCache, redisCache } from './storage/cache';
import { ThreadID } from '@textile/hub';
import query from './resolvers/query';
import mutations from './resolvers/mutations';
import { createApiProvider, getCurrentApiProvider, setupDBCollections } from './helpers';
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
app.use(helmet({ contentSecurityPolicy: false }));
app.use(json());
app.use(logger());
app.use(bodyParser());

const enabledDomains = JSON.parse(process.env.ALLOWED_ORIGINS);
const regExpCors = new RegExp(process.env.ALLOWED_ORIGIN_REGEXP);
app.use(
  cors({
    origin: ctx => {
      if (
        enabledDomains.indexOf(ctx.request.header.origin) !== -1 ||
        regExpCors.test(ctx.request.header.origin)
      ) {
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
  dataSources: () => createApiProvider(dbID),
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
  plugins: [
    createMetricsPlugin(promRegistry),
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
  ],
});

(async () => {
  await server.start();
  server.applyMiddleware({ app });
  await new Promise(resolve => app.listen({ port: PORT }, resolve));
  console.log(`graphql ready at http://localhost:${PORT}${server.graphqlPath}`);
})();
