import { UsernameTypes } from '@akashaorg/typings/ui';

/**
 * Utility to determine domain type of ENS names
 */
export const getEnsNameType = (name: string) => {
  let nameType = UsernameTypes.TEXTILE;
  if (name.includes('.eth')) {
    if (name.endsWith('.akasha.eth')) {
      nameType = UsernameTypes.AKASHA_ENS_SUBDOMAIN;
    } else {
      nameType = UsernameTypes.ENS_DOMAIN;
    }
  }
  return nameType;
};
