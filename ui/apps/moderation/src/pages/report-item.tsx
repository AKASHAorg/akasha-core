import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NavigateToParams } from '@akashaorg/typings/ui';

import ReportItem from '../components/report/report-item';

import { HOME } from '../routes';
import { preSelectedReasons, reasons } from '../utils';

export interface IReportItemPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ReportItemPage: React.FC<IReportItemPageProps> = props => {
  const { navigateTo } = props;

  const { itemType } = useParams();

  const { t } = useTranslation('app-moderation-ewa');

  const categories = reasons.map(reason => ({
    value: reason,
    label: t(reason),
  }));

  const handleCancelButtonClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[HOME],
    });
  };

  const handleConfirmButtonClick = () => {
    /**
     * handle update
     */
  };

  const translatedItemType = t(itemType);

  return (
    <ReportItem
      label={t(`Flagging ${translatedItemType[0].toUpperCase() + translatedItemType.slice(1)}`)}
      introLabel={t(`Can you please let us know why did this ${translatedItemType} bothers you?`)}
      maxLimitLabel={t('2 max')}
      selectedCategories={preSelectedReasons}
      moderationCategories={categories}
      maxSelection={2}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Proceed')}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
