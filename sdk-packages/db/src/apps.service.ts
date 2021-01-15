import { DB_INSTALLED_APPS_SERVICE } from './constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';

const service: AkashaService = (invoke, log) => {
  const APPS_COLLECTION = 'apps';

  const getInstalledApps = async () => {
    const { db, identity } = await invoke(authServices[AUTH_SERVICE]).getSession();
    const Collection = db.collection(APPS_COLLECTION);
    return await Collection.findOne({
      pubKey: { $eq: identity.public.toString() },
    });
  };
  const saveApp = async (args: { app: any; config?: any }) => {
    const { db, identity } = await invoke(authServices[AUTH_SERVICE]).getSession();
    const Collection = db.collection(APPS_COLLECTION);
    const doc = await getInstalledApps();
    if (!doc) {
      return Collection.save({
        pubKey: identity.public.toString(),
        apps: [{ name: args.app.name, source: args }],
      });
    }
    if (doc?.apps) {
      const index = doc.apps.findIndex(e => e.name === args.app.name);
      if (index === -1) {
        doc.apps.push(args);
      } else {
        log.info(`${args.app.name} is already installed`);
      }
    }
    return Collection.save(doc);
  };

  const removeApp = async (args: { name: string }) => {
    const { db } = await invoke(authServices[AUTH_SERVICE]).getSession();
    const Collection = db.collection(APPS_COLLECTION);
    const doc = await getInstalledApps();
    if (!doc) {
      return;
    }
    const index = doc.apps.findIndex(e => e.name === args.name);
    if (index === -1) {
      return;
    }
    doc.apps.splice(index, 1);
    return Collection.save(doc);
  };
  return { getInstalledApps, saveApp, removeApp };
};
export default { name: DB_INSTALLED_APPS_SERVICE, service: service };
