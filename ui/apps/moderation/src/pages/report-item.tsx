import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { NavigateToParams } from '@akashaorg/typings/ui';
import { useModerationCategory } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ReportItem from '../components/report/report-item';

import { HOME } from '../routes';
import { reportDetailsSubtitles, reasons } from '../utils';

export interface IReportItemPageProps {
  navigateTo: (args: NavigateToParams) => void;
}

export const ReportItemPage: React.FC<IReportItemPageProps> = props => {
  const { navigateTo } = props;

  const [step, setStep] = useState<number>(0);

  const { itemType } = useParams();

  const { t } = useTranslation('app-moderation-ewa');

  const moderationCategories = reasons.map(({ title }) => ({
    value: title,
    label: t('{{title}}', { title }),
  }));

  const allCategoriesLabel = t('All Categories');

  const { categories, handleCategoryClick } = useModerationCategory({
    moderationCategories,
    allCategoriesLabel,
    maxSelection: 2,
  });

  const handleSubtitleLinkClick = (link: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-legal',
      getNavigationUrl: () => link,
    });
  };

  const handleCancelButtonClick = () => {
    if (step === 1) {
      return setStep(0);
    }
    navigateTo?.({
      appName: '@akashaorg/app-moderation-ewa',
      getNavigationUrl: routes => routes[HOME],
    });
  };

  const handleConfirmButtonClick = () => {
    if (step === 0) {
      return setStep(1);
    }
    if (step === 1) return;
  };

  return (
    <ReportItem
      label={t('Flagging {{type}}', {
        type: itemType[0].toUpperCase() + itemType.slice(1),
      })}
      step={step}
      introLabel={
        step === 0
          ? t('Can you please let us know why did this {{itemType}} bothers you?', {
              itemType,
            })
          : t('Provide us with more details')
      }
      subTextLabel={step === 0 ? `${t('2 max')}.` : t('optional')}
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
      reasonPlaceholderLabel={`${t('Place some details here, if any')}...`}
      subtitleLabels={reportDetailsSubtitles.map(subtitle => ({
        ...subtitle,
        label: t('{{label}}', { label: subtitle.label }),
      }))}
      cancelButtonLabel={t('Cancel')}
      confirmButtonLabel={step === 0 ? t('Proceed') : t('Submit')}
      onPillClick={handleCategoryClick}
      onLinkClick={handleSubtitleLinkClick}
      onCancelButtonClick={handleCancelButtonClick}
      onConfirmButtonClick={handleConfirmButtonClick}
    />
  );
};
