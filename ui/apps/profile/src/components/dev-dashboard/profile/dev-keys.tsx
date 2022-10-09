import React from 'react';

import DS from '@akashaorg/design-system';
import { useGetDevKeys } from '@akashaorg/ui-awf-hooks';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { IDevKeyCardProps } from '@akashaorg/design-system/lib/components/DevKeyCard';

import CardTitle, { ICardTitleProps } from './card-title';

import menuRoute, { ADD_DEV_KEY, baseDeveloperRoute, DEV_DASHBOARD } from '../../../routes';

const { Box, DevKeyCard, HorizontalDivider, MainAreaCardBox, Spinner, Text } = DS;

type ExtendableProps = RootComponentProps & ICardTitleProps & IDevKeyCardProps;

interface IDevKeysCardProps extends ExtendableProps {
  className?: string;
  noKeysLabel: string;
  editLabel: string;
  deleteLabel: string;
}

const DevKeysCard: React.FC<IDevKeysCardProps> = props => {
  const { className, plugins, noKeysLabel, editLabel, deleteLabel } = props;

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

  const handleMenuItemClick = (id: string, action: string) => () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => `${baseDeveloperRoute}/${id}/${action}`,
    });
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        {...props}
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
                          handler: handleMenuItemClick(item.pubKey, 'edit'),
                        },
                        {
                          icon: 'trash',
                          label: deleteLabel,
                          iconColor: 'errorText',
                          handler: handleMenuItemClick(item.pubKey, 'delete'),
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
