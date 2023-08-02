import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type SidebarCTACardProps = {
  onDismissCard: () => void;
  onClickCTAButton: () => void;
};

const SidebarCTACard: React.FC<SidebarCTACardProps> = props => {
  const { onDismissCard, onClickCTAButton } = props;

  const { t } = useTranslation('ui-widget-sidebar');

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle="px-6 py-4 bg(grey9 dark:grey3)">
      <Stack justify="between" align="start">
        <Text
          variant="footnotes2"
          color={{ light: 'grey4', dark: 'grey7' }}
          customStyle="max-w-[90%]"
        >
          {`🪄${t('Add magic to your world by installing cool apps developed by the community')}`}
        </Text>

        <Button plain={true} onClick={onDismissCard}>
          <Icon type="XMarkIcon" size="sm" accentColor={true} />
        </Button>
      </Stack>

      <Box customStyle="w-fit h-fit self-end">
        <Button onClick={onClickCTAButton} label={t('Check them out')} variant="secondary" />
      </Box>
    </Stack>
  );
};

export default SidebarCTACard;
