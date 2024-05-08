import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import ProfileAvatarLoading from '@akashaorg/design-system-core/lib/components/ProfileAvatarButton/ProfileAvatarLoading';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { formatDate, formatRelativeTime } from '@akashaorg/design-system-core/lib/utils';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

type AuthorProfileAvatarProps = {
  authorId: string;
  createdAt: string;
  hidePublishTime?: boolean;
};

const AuthorProfileAvatar: React.FC<AuthorProfileAvatarProps> = props => {
  const { authorId, createdAt, hidePublishTime } = props;
  const { getTranslationPlugin, getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;
  const locale = getTranslationPlugin().i18n?.languages?.[0] || 'en';
  const publishTime = createdAt ? formatRelativeTime(createdAt, locale) : '';

  const onAvatarClick = (id: string) => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
    });
  };

  return (
    <Extension
      name={`profile_avatar_${authorId}`}
      loadingIndicator={<ProfileAvatarLoading />}
      emptyIndicator={<ProfileAvatarLoading />}
      extensionData={{
        dataTestId: 'entry-profile-detail',
        profileDID: authorId,
        href: `/@akashaorg/app-profile/${authorId}`,
        metadata: (
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
          </>
        ),
        onClick: e => {
          e.preventDefault();
          onAvatarClick(authorId);
        },
      }}
    />
  );
};

export default AuthorProfileAvatar;
