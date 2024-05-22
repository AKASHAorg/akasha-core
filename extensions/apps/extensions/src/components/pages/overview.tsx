import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ArrowLongRightIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import { Explore } from '../explore';
import routes, { INFO } from '../../routes';

export const Overview: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { getRoutingPlugin } = useRootComponentProps();
  const navigateTo = getRoutingPlugin().navigateTo;

  const isInstalled = true;

  const handleButtonClick = () => {
    if (!isInstalled) {
      navigate({
        to: routes[INFO],
      });
    } else {
      navigateTo({
        appName: '@akashaorg/app-vibes-console',
      });
    }
  };

  return (
    <Explore
      titleLabel={t("What's new!")}
      sections={[
        {
          assetName: t('vibes-console-explore'),
          title: t('Vibes Console'),
          description: `${t("Dive into AKASHA WORLD's Vibes Console!")} 💫 ${t("Your spot to become a moderator, explore applicants, and curate content. Together, let's shape our vibrant community!")}`,
          ctaNode: (
            <Button
              variant={isInstalled ? 'secondary' : 'primary'}
              label={isInstalled ? t('Installed') : t('Open')}
              customStyle="w-fit self-end"
              onClick={handleButtonClick}
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
    />
  );
};
