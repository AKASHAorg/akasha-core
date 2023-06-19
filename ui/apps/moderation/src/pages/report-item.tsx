import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useModerationCategory } from '@akashaorg/ui-awf-hooks';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { ReportItem, ReportItemConfirmation } from '../components/report';

import { BasePageProps } from './dashboard';
import { HOME } from '../routes';
import { reportDetailsSubtitles, reasons, externalLinks } from '../utils';

export const ReportItemPage: React.FC<BasePageProps> = props => {
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
    if (step < 2) {
      return setStep(step + 1);
    }
    /**
     * interact with api
     */
  };

  const handleCloseIconClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: () => '/feed',
    });
  };

  if (step === 2) {
    return (
      <ReportItemConfirmation
        titleLabel={t('Thank you for keeping our community safe')}
        subtitleLabel={t('Our moderators will review the report as soon as possible')}
        footnoteLabel={t('Feel like you want to contribute more to improve our community?')}
        ctaLabel={t('Join our Moderation Discourd channel')}
        onIconClick={handleCloseIconClick}
        ctaUrl={externalLinks.discord}
      />
    );
  }

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
