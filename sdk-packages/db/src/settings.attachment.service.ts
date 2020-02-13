import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { RxAttachmentCreator } from 'rxdb';
import { SettingsDoc } from './collection.types/settings';
import settings from './collections/settings';
import dbServices, { DB_SERVICE, DB_SETTINGS_ATTACHMENT, moduleName } from './constants';
import {
  getSettingsAttachment,
  putSettingsAttachment,
  removeSettingAttachment,
} from './db.methods/settings-attachment';

const service: AkashaService = (invoke, log) => {
  const { getDB } = invoke(dbServices[DB_SERVICE]);
  // @Todo: get address from current session
  const getSettingsDoc = async (ethAddress: string) => {
    const akashaDB = await getDB();
    const settingsDoc: SettingsDoc = await akashaDB[settings.name]
      .findOne({
        $and: [{ moduleName: { $eq: moduleName } }, { ethAddress: { $eq: ethAddress } }],
      })
      .exec();
    return settingsDoc;
  };

  // @Todo: add initial record if there are no results
  // idea: when you run for the first time the sdk there should be an initial migration
  const get = async (args: { id: string; ethAddress: string }) => {
    const settingsDoc = await getSettingsDoc(args.ethAddress);
    if (settingsDoc) {
      return getSettingsAttachment(settingsDoc, args.id);
    }
    return settingsDoc;
  };

  const put = async (args: { obj: RxAttachmentCreator; ethAddress: string }) => {
    let settingsDoc = await getSettingsDoc(args.ethAddress);
    if (!settingsDoc) {
      const akashaDB = await getDB();
      settingsDoc = await akashaDB[settings.name].insert({
        ethAddress: args.ethAddress,
        moduleName: moduleName,
        services: [],
      });
    }
    return putSettingsAttachment(settingsDoc, args.obj);
  };

  const deleteSettings = async (args: { id: string; ethAddress: string }) => {
    const settingsDoc = await getSettingsDoc(args.ethAddress);
    return removeSettingAttachment(settingsDoc, args.id);
  };
  return { get, put, deleteSettings };
};

export default { name: DB_SETTINGS_ATTACHMENT, service: service };
