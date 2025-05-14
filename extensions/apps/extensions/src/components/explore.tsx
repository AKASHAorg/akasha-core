import React from 'react';
import AppList from './app-list';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import ExtensionCard, { ExtensionCardProps } from '../components/extension-card';
import { ReactNode } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { getExtensionTypeLabel } from '../utils/extension-utils';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
export type TExploreProps = {
  titleLabel: string;
  popularExtensions?: ExtensionCardProps[];
  popularExtensionsLabel: string;
  viewAllLabel: string;
  cta: {
    title: string;
    description: string;
    action: ReactNode;
  };
  onViewAllClick: () => void;
};
export const Explore: React.FC<TExploreProps> = props => {
  const {
    titleLabel,
    popularExtensions,
    popularExtensionsLabel,
    viewAllLabel,
    cta,
    onViewAllClick,
  } = props;
  const { t } = useTranslation('app-extensions');
  return (
    <Stack spacing={4} className="mb-2">
      <Typography variant="h5">{titleLabel}</Typography>
      {popularExtensions?.length > 0 && (
        <ExtensionCard
          coverImageSrc={popularExtensions[0]?.coverImageSrc}
          displayName={popularExtensions[0]?.displayName}
          applicationType={popularExtensions[0]?.applicationType}
          extensionTypeLabel={t('{{extensionTypeLabel}}', {
            extensionTypeLabel: getExtensionTypeLabel(popularExtensions[0]?.applicationType),
          })}
          author={popularExtensions[0]?.author}
          description={popularExtensions[0]?.description}
          featured={true}
          action={popularExtensions[0]?.action}
        />
      )}
      {popularExtensions?.length > 1 && (
        <Stack spacing={4}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">{popularExtensionsLabel}</Typography>
            <Button variant="link" onClick={onViewAllClick} className="ml-auto">
              {viewAllLabel}
            </Button>
          </Stack>
          <AppList apps={popularExtensions.slice(1)} onLoadMore={() => null} />
        </Stack>
      )}
      <Card className="p-4">
        <Stack spacing={3}>
          <Typography variant="h6">{cta.title}</Typography>
          <Typography variant="sm">{cta.description}</Typography>
          {cta.action}
        </Stack>
      </Card>
    </Stack>
  );
};
