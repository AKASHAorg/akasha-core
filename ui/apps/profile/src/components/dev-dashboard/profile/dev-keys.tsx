import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { useGetDevKeys } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { IDevKeyCardProps } from '@akashaorg/design-system/lib/components/DevKeyCard';

import CardTitle from './card-title';

import menuRoute, { ADD_DEV_KEY, baseDeveloperRoute, DEV_DASHBOARD } from '../../../routes';

const { Box, DevKeyCard, HorizontalDivider, MainAreaCardBox, Spinner, Text } = DS;

interface IDevKeysCardProps extends IDevKeyCardProps {
  className?: string;
  noKeysLabel: string;
  editLabel: string;
  deleteLabel: string;
}

const DevKeysCard: React.FC<RootComponentProps & IDevKeysCardProps> = props => {
  const { className, plugins, noKeysLabel, editLabel, deleteLabel } = props;

  const { t } = useTranslation('app-profile');
  const getKeysQuery = useGetDevKeys(true);

  const devKeys = getKeysQuery.data || [];

  const handleClickCardTitleIcon = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_DASHBOARD],
    });
  };

  const handleClickCardTitleButton = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[ADD_DEV_KEY],
    });
  };

  const handleCopy = (value: string) => () => {
    navigator.clipboard.writeText(value);
  };

  const handleEditClick = (pubKey: string) => () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `${baseDeveloperRoute}/dev-keys/${pubKey}/edit`,
    });
  };

  const handleDeleteClick = (pubKey: string, keyName: string) => () => {
    props.navigateToModal({ name: 'delete-dev-key', pubKey, keyName });
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Dev Keys')}
        buttonLabel={t('New Dev Key')}
        onClickIcon={handleClickCardTitleIcon}
        onClickButton={handleClickCardTitleButton}
      />
      <HorizontalDivider />
      <Box pad={{ vertical: 'xsmall', horizontal: 'small' }}>
        {getKeysQuery.isFetching && <Spinner />}

        {!getKeysQuery.isFetching && (
          <>
            {!devKeys.length && (
              <Text size="medium" textAlign="center">
                {noKeysLabel}
              </Text>
            )}
            {!!devKeys.length && (
              <Box gap="small">
                {devKeys.map((item, idx) => (
                  <Box key={idx} gap="small">
                    <DevKeyCard
                      item={item}
                      {...props}
                      onCopyClick={handleCopy}
                      menuItems={[
                        {
                          icon: 'edit',
                          label: editLabel,
                          iconColor: 'primaryText',
                          handler: handleEditClick(item.pubKey),
                        },
                        {
                          icon: 'trash',
                          label: deleteLabel,
                          handler: handleDeleteClick(
                            item.pubKey,
                            item.name?.length ? item.name : props.nonameLabel,
                          ),
                        },
                      ]}
                    />
                    {idx < devKeys.length - 1 && <HorizontalDivider />}
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </Box>
    </MainAreaCardBox>
  );
};

export default DevKeysCard;
