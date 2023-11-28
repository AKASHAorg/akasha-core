import React from 'react';
import { useTranslation } from 'react-i18next';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type FallbackHeaderProps = {
  authenticatedDID: string;
  isLoggedIn: boolean;
};

const FallbackHeader: React.FC<FallbackHeaderProps> = ({ authenticatedDID, isLoggedIn }) => {
  const { t } = useTranslation('ui-widget-sidebar');

  const headerBackground = 'bg(secondaryLight/30 dark:grey5)';

  return (
    <Stack
      direction="row"
      justifyItems="stretch"
      customStyle={`p-4 border-b-1 border(grey9 dark:grey3) rounded-t-2xl ${headerBackground}`}
    >
      <Stack customStyle="w-fit h-fit mr-2">
        <Avatar profileId={authenticatedDID} avatar={null} isClickable={false} />
      </Stack>
      <Stack justify="center" customStyle={'w-fit flex-grow'}>
        {isLoggedIn && <Text variant="button-md">{t('Fetching your info...')}</Text>}
        <DidField
          did={authenticatedDID}
          textColor="grey7"
          copyLabel={t('Copy to clipboard')}
          copiedLabel={t('Copied')}
        />
      </Stack>
      <Stack customStyle="w-fit h-fit self-start">
        <Button variant="primary" size="sm" loading />
      </Stack>
    </Stack>
  );
};

export default FallbackHeader;
