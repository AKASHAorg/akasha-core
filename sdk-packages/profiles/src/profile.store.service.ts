import commonServices, {
  IPFS_SERVICE,
  VALIDATOR_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { PROFILE_STORE } from './constants';

export const linkedPropId = '/linkedProp';
export const linkedProp = {
  id: linkedPropId,
  type: 'object',
  properties: {
    provider: 'string',
    property: 'string',
    value: 'string',
  },
  dependencies: {
    value: ['provider', 'property'],
  },
};

const profileStoreId = '/profileStore';
const profileStore = {
  id: profileStoreId,
  type: 'object',
  properties: {
    avatar: { $ref: linkedPropId },
    name: { $ref: linkedPropId },
    description: { $ref: linkedPropId },
    coverImage: { $ref: linkedPropId },
    userName: { $ref: linkedPropId },
    url: { $ref: linkedPropId },
  },
};

const service: AkashaService = (invoke, log) => {

  let registeredSchema = false;
  const registerSchema = async () => {
    if (registeredSchema) return;
    log.info('registering Profile json-schema for validation');
    const validator = await invoke(commonServices[VALIDATOR_SERVICE]).getValidator();
    validator.addSchema(linkedProp, linkedPropId);
    validator.addSchema(profileStore, profileStoreId);
    registeredSchema = true;
    return;
  };

  const store = async profileData => {
    log.info('storing linked Profile data');
    if (!registeredSchema) {
      await registerSchema();
    }
    const validator = await invoke(commonServices[VALIDATOR_SERVICE]).getValidator();
    validator.validate(profileData, profileStoreId, { throwError: true });

    const ipfs = await invoke(commonServices[IPFS_SERVICE]).getInstance();
    const doc = {};
    for (const k of Object.keys(profileData)) {
      const cid = await ipfs.dag.put(profileData[k]);
      Object.assign(doc, { [k]: cid });
    }
    const docCid = await ipfs.dag.put(doc);
    return
  };

  return { registerSchema };
};

export default { service, name: PROFILE_STORE };
