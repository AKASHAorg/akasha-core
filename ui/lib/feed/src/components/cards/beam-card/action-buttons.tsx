import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Blocks } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Antenna } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { useTranslation } from 'react-i18next';

type ActionButtonsProps = {
  appName: string;
  showHiddenContent: boolean;
  showBlockName: boolean;
  onShowBlockName: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = props => {
  const { appName, showHiddenContent, showBlockName, onShowBlockName } = props;
  const { t } = useTranslation('ui-lib-feed');
  const showBlockNameStyle = `${
    showBlockName ? 'rounded-full h-9 w-9' : ''
  } transition-all ease-linear duration-300`;
  return (
    <>
      {appName && (
        <Stack direction="row" align="center" spacing="gap-x-2" customStyle="mr-auto">
          <Icon icon={<Antenna />} accentColor size="sm" />
          <Text variant="footnotes2" weight="normal" color={{ light: 'grey7', dark: 'grey6' }}>
            {t('Published via {{name}}', { name: appName })}
          </Text>
        </Stack>
      )}
      {showHiddenContent && (
        <Button onClick={onShowBlockName} plain>
          <Stack
            align="center"
            justify="center"
            background={
              showBlockName ? { light: 'secondaryLight/30', dark: 'grey5' } : 'transparent'
            }
            customStyle={showBlockNameStyle}
          >
            <Icon icon={<Blocks />} accentColor={true} />
          </Stack>
        </Button>
      )}
    </>
  );
};

export default ActionButtons;
