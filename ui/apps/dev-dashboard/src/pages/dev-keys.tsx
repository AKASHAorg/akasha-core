import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetDevKeys } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  DevKeyCard,
  DevKeyCardProps,
} from '@akashaorg/design-system-components/lib/components/DevKeyCard';

import { CardWrapper } from '../components/common';
import { sampleDevKeys } from '../utils/dummy-data';
import menuRoute, { ADD_DEV_KEY } from '../routes';

export type DevKeysCardProps = DevKeyCardProps & {
  noKeysLabel: string;
  editLabel: string;
  deleteLabel: string;
};

export const DevKeysCard: React.FC<RootComponentProps & DevKeysCardProps> = props => {
  const { plugins, noKeysLabel } = props;

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const { t } = useTranslation('app-dev-dashboard');

  const getKeysQuery = useGetDevKeys(true);

  const devKeys = sampleDevKeys;

  const handleAddDevKey = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[ADD_DEV_KEY],
    });
  };

  // const handleEditClick = (pubKey: string) => () => {
  //   navigateTo?.({
  //     appName: '@akashaorg/app-dev-dashboard',
  //     getNavigationUrl: () => `${menuRoute[DEV_KEYS]}/${pubKey}/edit`,
  //   });
  // };

  // const handleDeleteClick = (pubKey: string, keyName: string) => () => {
  //   props.navigateToModal({ name: 'delete-dev-key', pubKey, keyName });
  // };

  return (
    <CardWrapper
      titleLabel={t('Dev Keys')}
      confirmButtonLabel={t('New Dev Key')}
      onConfirmButtonClick={handleAddDevKey}
    >
      <Box customStyle="p-4">
        {getKeysQuery.isFetching && <Spinner />}

        {!getKeysQuery.isFetching && (
          <React.Fragment>
            {!devKeys.length && (
              <Text variant="subtitle1" align="center">
                {noKeysLabel}
              </Text>
            )}

            {!!devKeys.length && (
              <Box customStyle="space-y-3">
                {devKeys.map(item => (
                  <DevKeyCard {...props} item={item} />
                ))}
              </Box>
            )}
          </React.Fragment>
        )}
      </Box>
    </CardWrapper>
  );
};
