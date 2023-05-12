import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export const getUpdatedFields = (profile: Profile): Partial<Profile> => {
  const updatedFields = profile;
  // for (const key in providerData) {
  //   if (providerData.hasOwnProperty(key)) {
  //     // transform null values to empty strings
  //     if (!providerData[key]) {
  //       updatedFields[key] = '';
  //     } else {
  //       updatedFields[key] = providerData[key];
  //     }
  //     switch (key) {
  //       case ProfileProviderProperties.AVATAR:
  //         if (providerData[key] && typeof providerData[key] === 'object') {
  //           updatedFields[key] = {
  //             preview: providerData[key].src,
  //             prefix: '',
  //             isUrl: true,
  //           };
  //         }
  //         break;
  //       case ProfileProviderProperties.COVER_IMAGE:
  //         if (providerData[key] && typeof providerData[key] === 'object') {
  //           updatedFields[key] = {
  //             preview: providerData[key].url,
  //             prefix: '',
  //             isUrl: true,
  //           };
  //         }
  //         break;
  //       case ProfileProviderProperties.USERNAME:
  //         if (providerData.userName) {
  //           updatedFields[key] = providerData.userName;
  //         } else if (providerData.default && providerData.default.length > 0) {
  //           const userNameProvider = providerData.default.find(
  //             p =>
  //               p.property === ProfileProviderProperties.USERNAME &&
  //               p.provider === ProfileProviders.EWA_BASIC,
  //           );
  //           updatedFields[key] = userNameProvider ? userNameProvider.value : '';
  //         }
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // }
  return updatedFields;
};
