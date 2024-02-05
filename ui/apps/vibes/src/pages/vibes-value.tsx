import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import VibesValueCard from '@akashaorg/design-system-components/lib/components/VibesValuesCard/value-card';

import { values } from '../services/values';
import { externalLinks } from '../utils';

export const VibesValue: React.FC = () => {
  const { t } = useTranslation('app-vibes');

  const { value } = useParams();

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
