import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Blocks } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { Antenna } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
import { useTranslation } from 'react-i18next';
import { useGetAppsByIdQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import { selectAppDisplayName } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-by-id-query';

type ActionButtonsProps = {
  appId: string;
  showHiddenContent: boolean;
  showBlockName: boolean;
  onShowBlockName: () => void;
};

const ActionButtons: React.FC<ActionButtonsProps> = props => {
  const { appId, showHiddenContent, showBlockName, onShowBlockName } = props;
  const { t } = useTranslation('ui-lib-feed');
  const appReq = useGetAppsByIdQuery({
    variables: {
      id: appId,
    },
    skip: !appId,
  });
  const appDisplayName = selectAppDisplayName(appReq.data);
  const showBlockNameStyle = `${
    showBlockName ? 'rounded-full h-9 w-9' : ''
  } transition-all ease-linear duration-300`;
  return (
    <>
      {appDisplayName && (
        <Stack direction="row" align="center" spacing="gap-x-2" customStyle="mr-auto">
          <Antenna className="h-4 w-4 [&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark" />
          <Text variant="footnotes2" weight="normal" color={{ light: 'grey7', dark: 'grey6' }}>
            {t('Published via {{name}}', { name: appDisplayName })}
          </Text>
        </Stack>
      )}
      {showHiddenContent && (
        <button onClick={onShowBlockName}>
          <Stack
            align="center"
            justify="center"
            customStyle={`${showBlockName ? 'bg-secondaryLight/30 dark:bg-grey5' : 'transparent'} ${showBlockNameStyle}`}
          >
            <Blocks className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
          </Stack>
        </button>
      )}
    </>
  );
};

export default ActionButtons;
