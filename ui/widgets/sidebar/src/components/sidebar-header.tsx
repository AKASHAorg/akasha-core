import { getProfileImageVersionsWithMediaUrl, hasOwn } from '@akashaorg/ui-awf-hooks';
import React, { Suspense, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetProfileByDidSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { PowerIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type SidebarHeaderProps = {
  authenticatedDID: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  logoutClickHandler: () => void;
  loginClickHandler: () => void;
  handleAvatarClick: (authenticatedDID: string) => void;
};

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  authenticatedDID,
  isLoggedIn,
  isLoading,
  loginClickHandler,
  logoutClickHandler,
  handleAvatarClick,
}) => {
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

  const headerBackground = isLoading ? 'bg(secondaryLight/30 dark:grey5)' : '';

  //this padding style will adjust the header's vertical space to maintain the same height through different states
  const headerPadding = profileName && isLoggedIn && !isLoading ? 'pb-[2.125rem]' : '';

  return (
    <Stack
      direction="row"
      justifyItems="stretch"
      customStyle={`p-4 border-b-1 border(grey9 dark:grey3) rounded-t-2xl ${headerPadding} ${headerBackground}`}
    >
      <Stack customStyle="w-fit h-fit mr-2">
        <Avatar
          profileId={authenticatedDID}
          avatar={getProfileImageVersionsWithMediaUrl(avatar)}
          isClickable={isLoggedIn}
          onClick={() => handleAvatarClick(authenticatedDID)}
        />
      </Stack>
      <Stack justify="center" customStyle={'w-fit flex-grow'}>
        {!isLoggedIn && <Text variant="button-md"> {t('Guest')}</Text>}
        <Suspense fallback={<Text variant="button-md">{t('Fetching your info...')}</Text>}>
          <Text variant="button-md">{profileName}</Text>
        </Suspense>
        {isLoggedIn && (
          <DidField
            did={authenticatedDID}
            textColor="grey7"
            copyLabel={t('Copy to clipboard')}
            copiedLabel={t('Copied')}
          />
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
      <Stack customStyle="w-fit h-fit self-start">
        {isLoading && <Button variant="primary" size="sm" loading onClick={logoutClickHandler} />}
        {!isLoading && (
          <>
            {isLoggedIn && (
              <Button icon={<PowerIcon />} size="xs" iconOnly={true} onClick={logoutClickHandler} />
            )}
            {!isLoggedIn && (
              <Button size="sm" variant="primary" label="Connect" onClick={loginClickHandler} />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
};

export default SidebarHeader;
