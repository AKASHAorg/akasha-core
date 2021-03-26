import { UsernameTypes } from '@akashaproject/ui-awf-typings/lib/profile';

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
