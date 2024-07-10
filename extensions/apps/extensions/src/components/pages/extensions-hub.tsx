import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { ExtensionsHub } from '../extensions-hub';
import routes, { DEVELOPER_MODE } from '../../routes';

export const ExtensionsHubPage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const handleAppClick = (appId: string) => {
    navigate({
      to: '/info/$appId',
      params: {
        appId,
      },
    });
  };

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
            <Link
              target="_blank"
              to="https://github.com/AKASHAorg/akasha-core/issues"
              customStyle="w-fit self-end"
            >
              <Button
                size="md"
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
            <Button
              size="md"
              variant="text"
              iconDirection="right"
              icon={<ArrowLongRightIcon />}
              label={t('Start your journey')}
              customStyle="w-fit self-end"
              onClick={handleCTAClick}
            />
          ),
        },
      ]}
    />
  );
};
