import React from 'react';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Image from '@akashaorg/design-system-core/lib/components/Image';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import InfoCard from '@akashaorg/design-system-core/lib/components/InfoCard';
import { useTranslation } from 'react-i18next';
import { InstalledExtension, useInstalledExtensions } from './use-installed-extensions';

export type InstalledExtensionsProps = {
  titleLabel: string;
  publicImgPath?: string;
  assetExtension?: string;
  sections: {
    assetName?: string;
    title: string;
    discoverLabel?: string;
    description: string;
    description2?: string;
    onClickDiscover?: () => void;
  }[];
  handleAppClick: (appName: string) => void;
};

export const InstalledExtensions: React.FC<InstalledExtensionsProps> = props => {
  const {
    titleLabel,
    publicImgPath = '/images',
    assetExtension = 'webp',
    sections,
    handleAppClick,
  } = props;

  const { t } = useTranslation('app-extensions');

  const { data, error, loading } = useInstalledExtensions();

  const addAction = (ext: InstalledExtension) => ({
    ...ext,
    action: (
      <Button variant="secondary" label={t('Open')} onClick={() => handleAppClick(ext.name)} />
    ),
  });

  const installedExtensions = data?.map(addAction);
  const defaultExtensions = [];

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{titleLabel}</Text>
      <Card padding="p-4">
        <Stack spacing="gap-y-3" align="center">
          {loading && (
            <Stack spacing="gap-y-5" align="center">
              <Spinner />
              <Text variant="button-md">{t('Loading installed extensions')}</Text>
            </Stack>
          )}
          {error && (
            <InfoCard
              titleLabel={
                <Text variant="h5" align="center">
                  {t(`Uh-oh! We couldn't load`)} <br /> {t(`the extensions list!`)}
                </Text>
              }
              bodyLabel={
                <Text variant="body2" align="center" customStyle="w-60 sm:w-auto">
                  {t('There might be an issue with the database. Please try again later!')}
                </Text>
              }
              assetName="SearchApp_NotFound-min"
            />
          )}
          {installedExtensions && (
            <>
              {!installedExtensions.length && (
                <>
                  <Stack customStyle="h-52 w-52">
                    <Image
                      customStyle="object-contain"
                      src={`${publicImgPath}/${sections[0].assetName}.${assetExtension}`}
                    />
                  </Stack>
                  <Text variant="h6">{sections[0].title}</Text>
                  <Stack align="center">
                    <Text as="span" color={{ light: 'grey5', dark: 'grey6' }}>
                      <Button
                        variant="text"
                        size="md"
                        label={sections[0].discoverLabel}
                        onClick={sections[0].onClickDiscover}
                      />{' '}
                      {sections[0].description}
                    </Text>
                    <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
                      {sections[0].description2}
                    </Text>
                  </Stack>
                </>
              )}
              {!!installedExtensions.length && (
                <AppList
                  apps={installedExtensions}
                  //implementation requires pagination support on installed extensions service on sdk
                  onLoadMore={() => null}
                />
              )}
            </>
          )}
        </Stack>
      </Card>
      <Card padding="p-4" margin="mb-2">
        <Stack spacing="gap-y-3">
          <Text variant="h6">{sections[1].title}</Text>
          <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
            {sections[1].description}
          </Text>
          <AppList apps={defaultExtensions} onLoadMore={() => null} />
        </Stack>
      </Card>
    </Stack>
  );
};
