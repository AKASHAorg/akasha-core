import registerDBModule from '@akashaproject/sdk-db';
import { extractCallableServices } from '../utils';
import { DB_SETTINGS_ATTACHMENT } from '@akashaproject/sdk-db/lib/constants';

export const dbModule = registerDBModule();

/**
 *
 * @param channel
 * returns { db: { dbSettingsAttachment: { get, put, deleteSettings }}}
 */
export default function dbApi(channel) {
  const extractedServices = extractCallableServices(dbModule, channel);
  return {
    [dbModule.name]: {
      settingsAttachment: {
        get: extractedServices[DB_SETTINGS_ATTACHMENT]('get'),
        put: extractedServices[DB_SETTINGS_ATTACHMENT]('put'),
        deleteSettings: extractedServices[DB_SETTINGS_ATTACHMENT]('deleteSettings'),
      },
    },
  };
}
