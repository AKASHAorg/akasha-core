import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle from './card-title';

import menuRoute, { DEV_DASHBOARD } from '../../../routes';

const { HorizontalDivider, MainAreaCardBox } = DS;

interface IPublishedAppsCardProps {
  className?: string;
}

const PublishedAppsCard: React.FC<RootComponentProps & IPublishedAppsCardProps> = props => {
  const { className, plugins } = props;

  const { t } = useTranslation('app-profile');

  const handleClickCardTitleIcon = () => {
    plugins['@akashaorg/app-routing']?.routing.navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[DEV_DASHBOARD],
    });
  };

  return (
    <MainAreaCardBox className={className}>
      <CardTitle
        leftIcon={true}
        title={t('Published Apps')}
        onClickIcon={handleClickCardTitleIcon}
      />
      <HorizontalDivider />
    </MainAreaCardBox>
  );
};

export default PublishedAppsCard;
