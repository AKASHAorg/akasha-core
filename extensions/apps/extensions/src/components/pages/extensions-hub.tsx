import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { ExtensionsHub } from '../extensions-hub';

export const ExtensionsHubPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');

  return (
    <ExtensionsHub
      titleLabel={t('Extensions Hub')}
      sections={[
        {
          assetName: t('extensions-discover'),
          title: t('What would you like to see here'),
          description: t(
            'Create awesome extensions, spark your imagination, and be part of an enthusiastic developer community!',
          ),
          ctaNode: (
            <Link
              target="_blank"
              to="https://github.com/AKASHAorg/akasha-core/issues"
              customStyle="w-fit self-end"
            >
              <Button
                variant="text"
                label={t('Share your thoughts!')}
                customStyle="w-fit self-end"
              />
            </Link>
          ),
        },
        {
          title: t('Want to create your own extension?'),
          description: t(
            'Create awesome extensions, spark your imagination, and be part of an enthusiastic developer community!',
          ),
          ctaNode: (
            <Link target="_blank" to="https://docs.akasha.world" customStyle="w-fit self-end">
              <Button
                variant="text"
                iconDirection="right"
                icon={<ArrowLongRightIcon />}
                label={t('Read the documentation')}
              />
            </Link>
          ),
        },
      ]}
    />
  );
};
