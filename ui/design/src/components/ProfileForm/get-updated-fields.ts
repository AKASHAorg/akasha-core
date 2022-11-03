import { ProfileProviderProperties, ProfileProviders } from '@akashaorg/typings/ui';
import { IBoxData, IFormValues } from './index';
import { EnsTxtPresets } from './sections/social-link-input';

export const getUpdatedFields = (providerData: IBoxData): Partial<IFormValues> => {
  const updatedFields = {};
  for (const key in providerData) {
    if (providerData.hasOwnProperty(key)) {
      // transform null values to empty strings
      if (!providerData[key]) {
        updatedFields[key] = '';
      } else {
        updatedFields[key] = providerData[key];
      }
      switch (key) {
        case ProfileProviderProperties.AVATAR:
          if (providerData[key] && typeof providerData[key] === 'object') {
            updatedFields[key] = {
              preview: providerData[key].url,
              prefix: '',
              isUrl: true,
            };
          }
          break;
        case ProfileProviderProperties.COVER_IMAGE:
          if (providerData[key] && typeof providerData[key] === 'object') {
            updatedFields[key] = {
              preview: providerData[key].url,
              prefix: '',
              isUrl: true,
            };
          }
          break;
        case ProfileProviderProperties.USERNAME:
          if (providerData.userName) {
            updatedFields[key] = providerData.userName;
          } else if (providerData.default && providerData.default.length > 0) {
            const userNameProvider = providerData.default.find(
              p =>
                p.property === ProfileProviderProperties.USERNAME &&
                p.provider === ProfileProviders.EWA_BASIC,
            );
            updatedFields[key] = userNameProvider ? userNameProvider.value : '';
          }
          break;
        default:
          break;
      }
    }
  }
  // links are not in the root object, so we must take them from the providers array
  const socialLinksProvider = providerData.default.find(
    p =>
      p.property === ProfileProviderProperties.SOCIAL_LINKS &&
      p.provider === ProfileProviders.EWA_BASIC,
  );
  if (socialLinksProvider) {
    const links = JSON.parse(socialLinksProvider.value);
    if (links.length) {
      const socLinks = links.map((l, idx) => {
        if (l.type === EnsTxtPresets.URL) {
          return {
            id: idx,
            type: l.type,
            value: decodeURIComponent(l.value),
          };
        }
        return {
          id: idx,
          type: l.type,
          value: l.value,
        };
      });
      updatedFields[ProfileProviderProperties.SOCIAL_LINKS] = socLinks;
    }
  }
  return updatedFields;
};
