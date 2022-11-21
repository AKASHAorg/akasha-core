import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import CardTitle from './card-title';

import menuRoute, { DASHBOARD } from '../../routes';

const { HorizontalDivider, MainAreaCardBox } = DS;

interface IPublishedAppsCardProps {
  className?: string;
}

const PublishedAppsCard: React.FC<RootComponentProps & IPublishedAppsCardProps> = props => {
  const { className, plugins } = props;

  const { t } = useTranslation('app-dev-dashboard');

  const navigateTo = plugins['@akashaorg/app-routing']?.routing.navigateTo;

  const handleClickCardTitleIcon = () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[DASHBOARD],
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
