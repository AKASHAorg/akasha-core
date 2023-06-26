import React from 'react';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';
import { useGetDevKeys } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import {
  DevKeyCard,
  DevKeyCardProps,
} from '@akashaorg/design-system-components/lib/components/DevKeyCard';

import { CardWrapper } from '../components/common';

import menuRoute, { ADD_DEV_KEY, DEV_KEYS } from '../routes';
import { sampleDevKeys } from '../utils/dummy-data';

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

  const handleEditClick = (id: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => `${menuRoute[DEV_KEYS]}/${id}/edit`,
    });
  };

  const handleDeleteClick = (id: string, keyName: string) => () => {
    props.navigateToModal({ name: 'delete-dev-key', id, keyName });
  };

  return (
    <CardWrapper
      titleLabel={t('Dev Keys')}
      confirmButtonLabel={t('New Dev Key')}
      onConfirmButtonClick={handleAddDevKey}
    >
      <Box customStyle={`${getKeysQuery.isFetching && !!devKeys.length ? 'p-4' : 'p-0'}`}>
        {getKeysQuery.isFetching && <Spinner />}

        {!getKeysQuery.isFetching && (
          <>
            {!devKeys.length && (
              <Text variant="subtitle1" align="center">
                {noKeysLabel}
              </Text>
            )}

            {!!devKeys.length &&
              devKeys.map((item, idx) => (
                <React.Fragment key={`${item.id} ${item.name}`}>
                  <DevKeyCard
                    {...props}
                    item={item}
                    onEditButtonClick={handleEditClick(item.id)}
                    onDeleteButtonClick={handleDeleteClick(item.id, item.name)}
                  />

                  {idx < devKeys.length - 1 && <Divider />}
                </React.Fragment>
              ))}
          </>
        )}
      </Box>
    </CardWrapper>
  );
};
