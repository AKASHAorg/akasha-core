import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { NavigateToParams } from '@akashaorg/typings/ui';
import { useModerationCategory } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ReportItem from '../components/report/report-item';

import { HOME } from '../routes';
import { reasons } from '../utils';

export interface IReportItemPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ReportItemPage: React.FC<IReportItemPageProps> = props => {
  const { navigateTo } = props;

  const { itemType } = useParams();

  const { t } = useTranslation('app-moderation-ewa');

  const moderationCategories = reasons.map(({ title }) => ({
    value: title,
    label: t('{{title}}', title),
  }));

  const allCategoriesLabel = t('All Categories');

  const { categories, handleCategoryClick } = useModerationCategory({
    moderationCategories,
    allCategoriesLabel,
    maxSelection: 2,
  });

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

  return (
    <ReportItem
      label={t('Flagging {{type}}', {
        type: itemType[0].toUpperCase() + itemType.slice(1),
      })}
      introLabel={t('Can you please let us know why did this {{itemType}} bothers you?', {
        itemType,
      })}
      maxLimitLabel={t('2 max')}
      categories={categories}
      moderationCategories={moderationCategories}
      accordionNodes={categories
        .map(cat => reasons.find(el => el.title === cat))
        .map(el => ({
          titleNode: (
            <Box>
              <Text variant="button-sm">{el.title}</Text>
            </Box>
          ),
          contentNode: (
            <Box>
              <Text variant="footnotes2" color={{ light: 'grey5', dark: 'grey6' }}>
                {el.description}
              </Text>
            </Box>
          ),
        }))}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={t('Proceed')}
      onPillClick={handleCategoryClick}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
