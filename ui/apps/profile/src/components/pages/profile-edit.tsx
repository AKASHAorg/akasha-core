import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Tab from '@akashaorg/design-system-core/lib/components/Tab';
import { useTranslation } from 'react-i18next';
import {
  IProfileData,
  RootComponentProps,
  ProfileProviders,
  ProfileProviderProperties,
} from '@akashaorg/typings/ui';
import { LoginState, useEnsByAddress, useInterests } from '@akashaorg/ui-awf-hooks';
import { GeneralForm } from '@akashaorg/design-system-components/lib/components/EditProfile/GeneralForm';
import { SocialLinks } from '@akashaorg/design-system-components/lib/components/EditProfile/SocialLinks';
import { Interests } from '@akashaorg/design-system-components/lib/components/EditProfile/Interests';
import { useParams } from 'react-router';

export type ProfilePageProps = {
  profileData: IProfileData;
  loginState: LoginState;
};

const ProfileEdit: React.FC<RootComponentProps & ProfilePageProps> = props => {
  const { profileData } = props;

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;
  const { t } = useTranslation('app-profile');
  const { pubKey } = useParams<{
    pubKey: string;
  }>();

  const ENSReq = useEnsByAddress(profileData.ethAddress);

  const interestsReq = useInterests(profileData.pubKey);

  /* @TODO: move this logic into hooks module*/
  const socialLinks: { type: string; value: string }[] = React.useMemo(() => {
    if (profileData.default.length > 0) {
      const socialLinksProvider = profileData.default.find(
        p =>
          p.property === ProfileProviderProperties.SOCIAL_LINKS &&
          p.provider === ProfileProviders.EWA_BASIC,
      );
      if (socialLinksProvider) {
        const links = JSON.parse(socialLinksProvider.value);
        if (links.length > 0) {
          return links.map((link: { type: string; value: string }) => {
            if (link.type === 'url') {
              return {
                type: link.type,
                value: decodeURIComponent(link.value),
              };
            }
            return {
              type: link.type,
              value: link.value,
            };
          });
        }
      }
    }
    return [];
  }, [profileData]);

  return (
    <>
      <Stack direction="column" spacing="gap-y-4">
        <Tab labels={[t('General'), t('External URLs'), t('Your interests')]}>
          <GeneralForm
            header={{
              title: t('Avatar & Cover Image'),
              coverImage: profileData.coverImage,
              avatar: profileData.avatar,
              ethAddress: profileData.ethAddress,
              cancelLabel: t('Cancel'),
              deleteLabel: t('Delete'),
              saveLabel: t('Save'),
              imageTitle: {
                avatar: { label: t('Edit Avatar') },
                coverImage: { label: t('Edit Cover') },
              },
              deleteTitle: {
                avatar: { label: t('Delete Avatar') },
                coverImage: { label: t('Delete Cover') },
              },
              confirmationLabel: {
                avatar: t('Are you sure you want to delete your avatar?'),
                coverImage: t('Are you sure you want to delete your cover?'),
              },
            }}
            name={{ label: t('Name'), initialValue: profileData.name }}
            userName={{ label: t('Username'), initialValue: profileData.userName }}
            bio={{ label: t('Bio'), initialValue: profileData.description }}
            ens={{
              label: t('ENS Name'),
              initialValue:
                ENSReq.isFetching && !ENSReq.isFetched
                  ? 'loading'
                  : ENSReq.isFetched && ENSReq.data
                  ? ENSReq.data
                  : '',
            }}
            ensButton={{
              label: t('Fill info from ENS data'),
              handleClick: () => {
                //@TODO
              },
            }}
            cancelButton={{
              label: t('Cancel'),
              handleClick: () => {
                navigateTo({
                  appName: '@akashaorg/app-profile',
                  getNavigationUrl: () => `/${pubKey}`,
                });
              },
            }}
            saveButton={{
              label: t('Save'),
              handleClick: () => {
                //@TODO
              },
            }}
          />
          <SocialLinks
            title={t('External URLs')}
            addNewButtonLabel={t('Add new')}
            description={t(
              'You can add your personal websites or social links to be shared on your profile',
            )}
            socialLinks={socialLinks.map(link => link.value)}
            cancelButton={{
              label: t('Cancel'),
              handleClick: () => {
                navigateTo({
                  appName: '@akashaorg/app-profile',
                  getNavigationUrl: () => `/${pubKey}`,
                });
              },
            }}
            saveButton={{
              label: 'Save',
              handleClick: () => {
                //@TODO
              },
            }}
            onDelete={() => ({})}
          />
          {/*@TODO: Create loading and error states for interests list */}
          {interestsReq.status === 'success' && (
            <Interests
              title={t('Your interests')}
              description={t(
                'Your interests will help refine your social feed and throughout AKASHA World.  You can have a maximum of 10 topics',
              )}
              moreInterestTitle={t('Find more interests')}
              moreInterestDescription={t(
                'You can find more interests and add them to your list of interests!',
              )}
              moreInterestPlaceholder={t('Search for interests')}
              myInterests={interestsReq.data.map(interest => interest.name)}
              interests={interestsReq.data.map(interest => interest.name)}
              cancelButton={{
                label: t('Cancel'),
                handleClick: () => {
                  navigateTo({
                    appName: '@akashaorg/app-profile',
                    getNavigationUrl: () => `/${pubKey}`,
                  });
                },
              }}
              saveButton={{
                label: 'Save',
                handleClick: () => {
                  //@TODO
                },
              }}
            />
          )}
        </Tab>
      </Stack>
    </>
  );
};

export default ProfileEdit;
