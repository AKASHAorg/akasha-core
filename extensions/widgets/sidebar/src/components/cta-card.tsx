import React from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type SidebarCTACardProps = {
  onDismissCard: () => void;
  onClickCTAButton: () => void;
};

const SidebarCTACard: React.FC<SidebarCTACardProps> = props => {
  const { onDismissCard, onClickCTAButton } = props;

  const { t } = useTranslation('ui-widget-sidebar');

  return (
    <Stack direction="column" spacing={4} className="px-6 py-4 bg-grey9 dark:bg-grey3">
      <Stack direction="row" justifyContent="between" alignItems="start">
        <Text
          variant="footnotes2"
          color={{ light: 'grey4', dark: 'grey7' }}
          customStyle="max-w-[90%]"
        >
          {`🪄${t('Add magic to your world by installing cool apps developed by the community')}`}
        </Text>

        <button onClick={onDismissCard}>
          <Icon icon={<XMarkIcon />} size="sm" accentColor={true} />
        </button>
      </Stack>

      <Stack className="w-fit h-fit self-end">
        <Button onClick={onClickCTAButton} variant="outline" size="sm">
          {t('Check them out')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SidebarCTACard;
