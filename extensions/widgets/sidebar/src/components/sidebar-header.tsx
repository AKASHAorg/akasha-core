import React, { Suspense, useMemo, useState } from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import ProfileNameField from '@akashaorg/design-system-core/lib/components/ProfileNameField';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { cn } from '@akashaorg/ui/lib/library/utils';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { transformSource, hasOwn } from '@akashaorg/ui-core-hooks';
import { useTranslation } from 'react-i18next';
import { useGetProfileByDidSuspenseQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import {
  PowerIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';

export type SidebarHeaderProps = {
  authenticatedDID: string;
  connectLabel: string;
  cancelLabel: string;
  isLoggedIn: boolean;
  isAuthenticating: boolean;
  logoutClickHandler: () => void;
  loginClickHandler: () => void;
  handleProfileAvatarClick: (authenticatedDID: string) => void;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  authenticatedDID,
  connectLabel,
  cancelLabel,
  isLoggedIn,
  isAuthenticating,
  loginClickHandler,
  logoutClickHandler,
  handleProfileAvatarClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const { t } = useTranslation('ui-widget-sidebar');

  const { data, error } = useGetProfileByDidSuspenseQuery({
    variables: {
      id: authenticatedDID,
    },
    skip: !authenticatedDID,
  });

  const profileName = useMemo(() => {
    if (data) {
      return hasOwn(data?.node, 'akashaProfile') ? data?.node?.akashaProfile?.name : '';
    }
  }, [data]);

  const avatar = useMemo(() => {
    if (data) {
      return hasOwn(data?.node, 'akashaProfile') ? data?.node?.akashaProfile?.avatar : null;
    }
  }, [data]);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // this padding style will adjust the header's vertical space to maintain the same height through different states
  const headerPadding = profileName && isLoggedIn && !isAuthenticating ? 'pb-[2.125rem]' : '';

  if (error) return null;

  return (
    <Stack
      direction="row"
      className={cn(
        `p-4 border-b-1 border-grey9 dark:border-grey3 rounded-t-2xl`,
        headerPadding,
        isAuthenticating && 'bg-secondaryLight/30 dark:bg-grey5',
      )}
    >
      <Stack direction="row" className="grow group">
        <Stack className="w-fit h-fit mr-2">
          <button onClick={() => handleProfileAvatarClick(authenticatedDID)} disabled={!isLoggedIn}>
            <ProfileAvatar profileDID={authenticatedDID} size="lg">
              <ProfileAvatarImage src={transformSource(avatar?.default)?.src} />
              <ProfileAvatarFallback />
            </ProfileAvatar>
          </button>
        </Stack>
        <Stack justifyContent="center" className="w-fit flex-grow">
          {!isLoggedIn && <Text variant="button-md"> {t('Guest')}</Text>}
          {isLoggedIn && (
            <Suspense fallback={<Text variant="button-md">{t('Fetching your info...')}</Text>}>
              <button onClick={() => handleProfileAvatarClick(authenticatedDID)}>
                <ProfileNameField
                  did={authenticatedDID}
                  profileName={profileName}
                  size="md"
                  truncateText
                  showMissingNameWarning
                  missingNameWarningLabel={t(
                    'Your profile is unfollowable due to the lack of basic information, like your name.',
                  )}
                  hover={true}
                />
              </button>
            </Suspense>
          )}
          {isLoggedIn && (
            <ProfileAvatarButton profileDID={authenticatedDID}>
              <ProfileDidField />
            </ProfileAvatarButton>
          )}
          {!isLoggedIn && (
            <Text
              variant="footnotes2"
              color="grey7"
              customStyle="whitespace-normal"
              truncate
              breakWord
            >
              {t('Connect to see')}
              <br />
              {t('member only features.')}
            </Text>
          )}
        </Stack>
      </Stack>
      <Stack className="w-fit h-fit self-start">
        {isAuthenticating && (
          <Button
            variant="default"
            size="sm"
            onClick={logoutClickHandler}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            loading={!isHovered}
          >
            {isHovered && (
              <>
                {cancelLabel} <XMarkIcon />
              </>
            )}
          </Button>
        )}
        {!isAuthenticating && (
          <>
            {isLoggedIn && (
              <Button variant="outline" size="icon" onClick={logoutClickHandler}>
                <PowerIcon />
              </Button>
            )}
            {!isLoggedIn && (
              <Button size="sm" onClick={loginClickHandler}>
                {connectLabel}
              </Button>
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default SidebarHeader;
