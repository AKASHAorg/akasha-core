import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import ProfileAvatarLoading from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton/ProfileAvatarLoading';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import { formatDate, formatRelativeTime } from '@akashaorg/design-system-core/lib/utils';
import {
  hasOwn,
  transformSource,
  useAkashaStore,
  useNsfwToggling,
  useRootComponentProps,
} from '@akashaorg/ui-core-hooks';
import { useTranslation } from 'react-i18next';
import { useGetProfileByDidQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';

type AuthorProfileAvatarProps = {
  authorId: string;
  createdAt: string;
  hidePublishTime?: boolean;
  pending?: boolean;
};

const AuthorProfileAvatar: React.FC<AuthorProfileAvatarProps> = props => {
  const { authorId, createdAt, hidePublishTime, pending } = props;
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const { t } = useTranslation('ui-lib-feed');
  const { getTranslationPlugin, getCorePlugins } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;
  const locale = getTranslationPlugin().i18n?.languages?.[0] || 'en';
  const publishTime = createdAt ? formatRelativeTime(createdAt, locale) : '';
  const profileQuery = useGetProfileByDidQuery({
    variables: { id: authorId },
    fetchPolicy: 'cache-first',
  });
  const { showNsfw } = useNsfwToggling();

  const onAvatarClick = (id: string) => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
    });
  };

  if (profileQuery?.loading) return <ProfileAvatarLoading />;

  if (profileQuery?.error) return null;

  const profileData =
    profileQuery.data?.node && hasOwn(profileQuery.data.node, 'isViewer')
      ? profileQuery.data.node.akashaProfile
      : null;

  return (
    <a
      href={`/@akashaorg/app-profile/${authorId}`}
      rel="noreferrer noopener"
      onClick={event => {
        event.preventDefault();
        event.stopPropagation();
      }}
    >
      <ProfileAvatarButton
        {...(profileData?.nsfw && {
          nsfwLabel: 'NSFW',
          nsfw: !(authenticatedDID === profileData?.did?.id || showNsfw),
        })}
        profileDID={authorId}
        metadata={
          <>
            {publishTime && !hidePublishTime && (
              <Stack direction="row" align="center" spacing="gap-x-1">
                <Text
                  variant="footnotes2"
                  weight="normal"
                  color={{ light: 'grey4', dark: 'grey7' }}
                >
                  ·
                </Text>
                <Tooltip
                  placement={'top'}
                  content={createdAt ? formatDate(createdAt, 'H[:]mm [·] D MMM YYYY', locale) : ''}
                >
                  <Text
                    variant="footnotes2"
                    weight="normal"
                    color={{ light: 'grey4', dark: 'grey7' }}
                  >
                    {publishTime}
                  </Text>
                </Tooltip>
              </Stack>
            )}
            {pending && (
              <Stack direction="row" align="center" spacing="gap-x-1">
                <Text
                  variant="footnotes2"
                  weight="normal"
                  color={{ light: 'grey4', dark: 'grey7' }}
                >
                  ·
                </Text>
                <Text
                  variant="footnotes2"
                  weight="normal"
                  color={{ light: 'grey4', dark: 'grey7' }}
                >
                  {t('Pending')}...
                </Text>
              </Stack>
            )}
          </>
        }
        onClick={() => {
          onAvatarClick(authorId);
        }}
      >
        <ProfileAvatarButtonAvatar>
          <ProfileAvatarButtonAvatarImage
            src={transformSource(profileData?.avatar?.default)?.src}
            alt="Author Avatar"
          />
          <ProfileAvatarButtonAvatarFallback
            alternativeSrc={profileData?.avatar?.alternatives?.map(
              alternative => transformSource(alternative)?.src,
            )}
          />
        </ProfileAvatarButtonAvatar>
        <ProfileName>{profileData?.name}</ProfileName>
        <ProfileDidField />
      </ProfileAvatarButton>
    </a>
  );
};

export default AuthorProfileAvatar;
