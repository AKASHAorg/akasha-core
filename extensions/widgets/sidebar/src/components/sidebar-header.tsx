import React, { Suspense, useMemo, useState } from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { cn } from '@akashaorg/ui/lib/library/utils';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { transformSource, hasOwn } from '@akashaorg/ui-core-hooks';
import { useTranslation } from 'react-i18next';
import { useGetProfileByDidSuspenseQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { PowerIcon, TriangleAlertIcon, XIcon } from 'lucide-react';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import {
  ProfileAvatarButton,
  ProfileDidField,
  ProfileName,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import { CopyToClipboard } from '@akashaorg/ui/lib/akasha-components/copy-to-clipboard';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@akashaorg/ui/lib/akasha-components/tooltip';
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
          {!isLoggedIn && (
            <Typography variant="sm" bold>
              {' '}
              {t('Guest')}
            </Typography>
          )}
          {isLoggedIn && (
            <Suspense
              fallback={
                <Typography variant="sm" bold>
                  {t('Fetching your info...')}
                </Typography>
              }
            >
              <button onClick={() => handleProfileAvatarClick(authenticatedDID)}>
                <ProfileAvatarButton profileDID={authenticatedDID}>
                  {profileName ? (
                    <ProfileName>{profileName}</ProfileName>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1">
                        <ProfileName>{t('Empty Profile')}</ProfileName>
                        <TriangleAlertIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom">
                        {t(
                          'Your profile is unfollowable due to the lack of basic information, like your name.',
                        )}
                      </TooltipContent>
                    </Tooltip>
                  )}
                </ProfileAvatarButton>
              </button>
            </Suspense>
          )}
          {isLoggedIn && (
            <ProfileAvatarButton profileDID={authenticatedDID}>
              <CopyToClipboard
                textToCopy={authenticatedDID}
                ctaText="Copy to clipboard"
                successText="Copied"
              >
                <ProfileDidField />
              </CopyToClipboard>
            </ProfileAvatarButton>
          )}
          {!isLoggedIn && (
            <Typography
              variant="xs"
              className="font-medium text-grey7 whitespace-normal truncate break-all"
            >
              {t('Connect to see')}
              <br />
              {t('member only features.')}
            </Typography>
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
                {cancelLabel}{' '}
                <XIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
              </>
            )}
          </Button>
        )}
        {!isAuthenticating && (
          <>
            {isLoggedIn && (
              <Button variant="outline" size="icon" onClick={logoutClickHandler}>
                <PowerIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
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
