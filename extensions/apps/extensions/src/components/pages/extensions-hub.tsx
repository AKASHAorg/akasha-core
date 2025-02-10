import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { ExtensionsHub } from '../extensions-hub';
import routes, { DEVELOPER_MODE } from '../../routes';

export const ExtensionsHubPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const handleCTAClick = () => {
    navigate({
      to: routes[DEVELOPER_MODE],
    });
  };
  // @TODO fetch real data
  const extensions = [];

  return (
    <ExtensionsHub
      titleLabel={t('Extensions Hub')}
      extensions={extensions}
      sections={[
        {
          assetName: t('extensions-discover'),
          title: t('What would you like to see here'),
          description: t(
            'Create awesome extensions, spark your imagination, and be part of an enthusiastic developer community!',
          ),
          ctaNode: (
            <Button variant="link" className="w-fit self-end" asChild>
              <a
                rel="noreferrer"
                href={'https://github.com/AKASHAorg/akasha-core/issues'}
                target="_blank"
              >
                {t('Share your thoughts!')}
              </a>
            </Button>
          ),
        },
        {
          title: t('Want to create your own extension?'),
          description: t(
            'Create awesome extensions, spark your imagination, and be part of an enthusiastic developer community!',
          ),
          ctaNode: (
            <Button variant="link" onClick={handleCTAClick} className="w-fit self-end">
              {t('Start your journey')}
              <ArrowLongRightIcon />
            </Button>
          ),
        },
      ]}
    />
  );
};
