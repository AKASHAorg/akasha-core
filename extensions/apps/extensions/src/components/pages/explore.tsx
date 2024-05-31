import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { Explore } from '../explore';
import routes, { EXTENSIONS } from '../../routes';

export const ExplorePage: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const isInstalled = false;

  const handleButtonClick = (appId: string) => {
    if (!isInstalled) {
      navigate({
        to: '/info/$appId',
        params: {
          appId,
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

  const description = t(
    'Play with your friends in AKASHA World and enjoy a couple of puzzle games or drawing games or any kind of game!',
  );

  const latestExtensions = [
    {
      id: 'supercart1',
      name: t('Supercarts'),
      description,
    },
    {
      id: 'newsreader2',
      name: t('News Reader'),
      description,
    },
    {
      id: 'nftgallery3',
      name: t('NFT Gallery'),
      description,
    },
  ];

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
              onClick={() => handleButtonClick('vibesconsole')}
            />
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
      latestExtensionsLabel={t('Latest Extensions')}
      latestExtensions={latestExtensions.map(ext => ({
        ...ext,
        action: (
          <Button variant="primary" label={t('Open')} onClick={() => handleAppClick(ext.id)} />
        ),
      }))}
      buttonLabel={t('View All')}
      onViewAllClick={handleViewAllLatestExtensions}
      onAppClick={handleAppClick}
    />
  );
};
