// import authApi, { authModule } from './auth';
// import commonApi, { commonModule } from './common';
// import dbApi, { dbModule } from './db';
// import profilesApi, { profilesModule } from './profiles';
// import registryApi, { registryModule } from './registry';
// import postsAPI, { postsModule } from './posts';
import DIContainer from '@akashaproject/sdk-runtime/lib/DIContainer';
import { startServices } from '../utils';
import { Observable } from 'rxjs';

export default async function startApi(channel, di: DIContainer, globalChannel: Observable<any>) {
  const authModule = import(/* webpackChunkName: "authModule" */ './auth');
  const commonModule = import(/* webpackChunkName: "commonModule" */ './common');
  const dbModule = import(/* webpackChunkName: "dbModule" */ './db');
  const profilesModule = import(/* webpackChunkName: "profilesModule" */ './profiles');
  const registryModule = import(/* webpackChunkName: "registryModule" */ './registry');
  const postsModule = import(/* webpackChunkName: "postsModule" */ './posts');
  const [auth, common, db, profiles, registry, posts] = await Promise.all([
    authModule,
    commonModule,
    dbModule,
    profilesModule,
    registryModule,
    postsModule,
  ]);
  // prepare services
  startServices(
    [
      auth.authModule,
      common.commonModule,
      db.dbModule,
      profiles.profilesModule,
      registry.registryModule,
      posts.postsModule,
    ],
    di,
    globalChannel,
  );
  // assemble the api object
  const apiMap = [
    auth.default,
    common.default,
    db.default,
    profiles.default,
    registry.default,
    posts.default,
  ].map(api => api(channel));
  return apiMap.reduce((acc, current) => Object.assign(acc, current), {});
}
