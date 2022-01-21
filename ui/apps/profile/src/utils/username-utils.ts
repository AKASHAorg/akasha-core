import {
  IProfileData,
  ProfileProviderProperties,
  ProfileProviders,
  UsernameTypes,
} from '@akashaproject/ui-awf-typings/lib/profile';

export const getUsernameTypes = (profile: IProfileData) => {
  const type: UsernameTypes[] = [];

  const defaultProvider = profile.default?.find(
    p => p.property === ProfileProviderProperties.USERNAME,
  );

  if (profile.providers?.length) {
    profile.providers.forEach(
      (provider: {
        provider: ProfileProviders;
        property: ProfileProviderProperties;
        value: string;
      }) => {
        if (provider.property === ProfileProviderProperties.USERNAME) {
          if (provider.provider === ProfileProviders.ENS) {
            if (provider.value.endsWith('.akasha.eth')) {
              type.push(UsernameTypes.AKASHA_ENS_SUBDOMAIN);
            } else if (provider.value.endsWith('.eth')) {
              type.push(UsernameTypes.ENS_DOMAIN);
            }
          }
          if (provider.provider === ProfileProviders.EWA_BASIC) {
            type.push(UsernameTypes.TEXTILE);
          }
        }
      },
    );
  }
  return {
    default: defaultProvider,
    available: type,
  };
};
