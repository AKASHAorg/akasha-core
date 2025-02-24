import React from 'react';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionCard, {
  ExtensionCardProps,
} from '@akashaorg/design-system-components/lib/components/ExtensionCard';
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
    <Stack spacing="gap-y-4" customStyle="mb-2">
      <Text variant="h5">{titleLabel}</Text>
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
        <Stack spacing="gap-y-4">
          <Stack direction="row" align="center" spacing="gap-x-2">
            <Text variant="h6">{popularExtensionsLabel}</Text>
            <Button variant="link" onClick={onViewAllClick} className="ml-auto">
              {viewAllLabel}
            </Button>
          </Stack>
          <AppList apps={popularExtensions.slice(1)} onLoadMore={() => null} />
        </Stack>
      )}
      <Card className="p-4">
        <Stack spacing="gap-y-3">
          <Text variant="h6">{cta.title}</Text>
          <Text variant="body2">{cta.description}</Text>
          {cta.action}
        </Stack>
      </Card>
    </Stack>
  );
};
