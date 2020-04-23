import commonServices, {
  IPFS_SERVICE,
  VALIDATOR_SERVICE,
} from '@akashaproject/sdk-common/lib/constants';
import { AkashaService } from '@akashaproject/sdk-core/lib/IAkashaModule';
import { runGQL } from '@akashaproject/sdk-runtime/lib/gql.network.client';
import { LinkedProfileProp, PROFILE_STORE } from './constants';

export const linkedPropId = '/linkedProp';
export const linkedProp = {
  id: linkedPropId,
  type: 'object',
  properties: {
    provider: 'string', // app:3box
    property: 'string', // name
    value: 'string', // john doe
  },
  dependencies: {
    value: ['provider', 'property'],
  },
};
export const cidFormat = { format: 'dag-cbor', hashAlg: 'sha3-512', pin: true };
const service: AkashaService = (invoke, log) => {
  let registeredSchema = false;
  const registerSchema = async () => {
    if (registeredSchema) {
      return;
    }
    log.info('registering Profile json-schema for validation');
    const validator = await invoke(commonServices[VALIDATOR_SERVICE]).getValidator();
    validator.addSchema(linkedProp, linkedPropId);
    registeredSchema = true;
    return;
  };

  const store = async (profileData: LinkedProfileProp[]) => {
    log.info('storing linked Profile data');
    if (!registeredSchema) {
      await registerSchema();
    }
    const validator = await invoke(commonServices[VALIDATOR_SERVICE]).getValidator();
    const ipfs = await invoke(commonServices[IPFS_SERVICE]).getInstance();
    const doc = {};
    for (const record of profileData) {
      validator.validate(record.data, linkedPropId, { throwError: true });
      const cidLinkedData = await ipfs.dag.put(record.data, cidFormat);
      Object.assign(doc, { [record.field]: cidLinkedData });
    }
    const profileCID = await ipfs.dag.put(doc, cidFormat);
    return profileCID.toBaseEncodedString();
  };

  const getProfile = async (opt: { fields: string[]; ethAddress: string }) => {
    log.info('fetching data from graphql server for profile data', opt);
    const query = `
  query GetProfile($ethAddress: String!) {
       profile(ethAddress: $ethAddress) {
         ${opt.fields.concat(' ')}
       }
      }`;
    return runGQL({
      query: query,
      variables: { ethAddress: opt.ethAddress },
      operationName: 'GetProfile',
    });
  };
  return { registerSchema, store, getProfile };
};

export default { service, name: PROFILE_STORE };
