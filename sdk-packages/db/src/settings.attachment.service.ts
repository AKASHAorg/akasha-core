import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { DB_SETTINGS_ATTACHMENT } from './constants';
import authServices, { AUTH_SERVICE } from '@akashaproject/sdk-auth/lib/constants';

const service: AkashaService = (invoke, log) => {
  const SETTINGS_COLLECTION = 'settings';
  const get = async (obj: { moduleName: string }) => {
    const { db, identity } = await invoke(authServices[AUTH_SERVICE]).getSession();
    const Collection = db.collection(SETTINGS_COLLECTION);
    return await Collection.findOne({
      $and: [
        {
          pubKey: { $eq: identity.public.toString() },
        },
        {
          moduleName: { $eq: obj.moduleName },
        },
      ],
    });
  };

  const put = async (obj: { moduleName: string; _id?: string; services?: [] }) => {
    const { db, identity } = await invoke(authServices[AUTH_SERVICE]).getSession();
    const Collection = db.collection(SETTINGS_COLLECTION);
    if (!obj._id) {
      const exists = await get({ moduleName: obj.moduleName });
      if (exists) {
        Object.assign(obj, { _id: exists._id });
      }
    }
    const doc = Object.assign({}, obj, { pubKey: identity.public.toString() });
    return Collection.save(doc);
  };

  const deleteSettings = async (args: { _id?: string; moduleName?: string }) => {
    const { db } = await invoke(authServices[AUTH_SERVICE]).getSession();
    const Collection = db.collection(SETTINGS_COLLECTION);
    if (!args._id) {
      const exists = await get({ moduleName: args.moduleName });
      return await Collection.delete(exists._id);
    }
    if (args._id) {
      return await Collection.delete(args._id);
    }
  };
  return { get, put, deleteSettings };
};

export default { name: DB_SETTINGS_ATTACHMENT, service: service };
