import React from 'react';
import { useTranslation } from 'react-i18next';
import VibesValueCard from '../components/vibes-values-card/value-card';
import { values } from '../services/values';
import { externalLinks } from '../utils';

export type VibesValuePageProps = {
  value: string;
};

export const VibesValue: React.FC<VibesValuePageProps> = props => {
  const { value } = props;
  const { t } = useTranslation('app-vibes');

  const activeValue = values.find(v => v.path === value);

  return (
    <VibesValueCard
      label={t('{{label}}', { label: activeValue.title })}
      assetName={activeValue.assetName}
      description={t('{{description}}', { description: activeValue.description })}
      ctaLabel={t('Discuss this value')}
      ctaUrl={externalLinks.discourse.values}
    />
  );
};
