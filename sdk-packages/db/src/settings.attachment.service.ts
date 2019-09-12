import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { registerServiceMethods, toNamedService } from '@akashaproject/sdk-core/lib/utils';
import { RxAttachmentCreator } from 'rxdb';
import { SettingsDoc } from './collection.types/settings';
import settings from './collections/settings';
import dbServices, { DB_SERVICE, DB_SETTINGS_ATTACHMENT, moduleName } from './constants';
import {
  getSettingsAttachment,
  putSettingsAttachment,
  removeSettingAttachment,
} from './db.methods/settings-attachment';

const service: AkashaService = invoke => {
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
  const get = async (id: string, ethAddress: string) => {
    const settingsDoc = await getSettingsDoc(ethAddress);
    return getSettingsAttachment(settingsDoc, id);
  };

  const put = async (obj: RxAttachmentCreator, ethAddress: string) => {
    const settingsDoc = await getSettingsDoc(ethAddress);
    return putSettingsAttachment(settingsDoc, obj);
  };

  const deleteSettings = async (id: string, ethAddress: string) => {
    const settingsDoc = await getSettingsDoc(ethAddress);
    return removeSettingAttachment(settingsDoc, id);
  };
  return registerServiceMethods({ get, put, deleteSettings });
};

export default toNamedService(DB_SETTINGS_ATTACHMENT, service);
