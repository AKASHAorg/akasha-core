import { genProfileByDID } from '@akashaorg/af-testing';
import { CreateProfileDocument } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

type IGetProfileInfoMocks = {
  profileDID: string;
  nsfw?: boolean;
};

export function getEditProfileMocks({ profileDID, nsfw }: IGetProfileInfoMocks) {
  const profileData = genProfileByDID({ profileDID, nsfw });
  return {
    mocks: [
      {
        delay: 100,
        request: {
          query: CreateProfileDocument,
        },
        variableMatcher: () => true,
        result: {
          data: {
            createAkashaProfile: {
              document: profileData,
              clientMutationId: '',
            },
          },
        },
      },
    ],
    profileData,
  };
}
