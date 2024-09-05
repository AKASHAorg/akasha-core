import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Explore } from '../explore';
import routes, { DEVELOPER_MODE, EXTENSIONS } from '../../routes';

export const ExplorePage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { getCorePlugins, encodeAppName } = useRootComponentProps();
  const navigateTo = getCorePlugins().routing.navigateTo;

  const isInstalled = false;

  const handleButtonClick = (appId: string) => {
    if (!isInstalled) {
      navigate({
        to: '/info/$appId',
        params: {
          appId: encodeAppName(appId),
        },
      });
    } else {
      navigateTo({
        appName: '@akashaorg/app-vibes-console',
      });
    }
  };

  const handleViewAllLatestExtensions = () => {
    navigate({
      to: routes[EXTENSIONS],
    });
  };

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
  const latestExtensions = [];

  return (
    <Explore
      titleLabel={t("What's new!")}
      sections={[
        {
          assetName: t('vibes-console-explore'),
          title: t('Vibes Console'),
          description: `${t("Dive into AKASHA WORLD's Vibes Console!")} 💫 ${t("Your spot to become a moderator, explore applicants, and curate content. Together, let's shape our vibrant community!")} 🌟🔍✨`,
          ctaNode: (
            <Button
              variant={isInstalled ? 'secondary' : 'primary'}
              label={isInstalled ? t('Installed') : t('Open')}
              customStyle="w-fit self-end"
              onClick={() => handleButtonClick('@akashaorg/app-vibes-console')}
            />
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
      latestExtensionsLabel={t('Latest Extensions')}
      latestExtensions={latestExtensions.map(ext => ({
        ...ext,
        action: (
          <Button variant="primary" label={t('Open')} onClick={() => handleAppClick(ext.id)} />
        ),
      }))}
      buttonLabel={t('View All')}
      onViewAllClick={handleViewAllLatestExtensions}
    />
  );
};
