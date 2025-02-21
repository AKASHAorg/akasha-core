import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
// import {
//   InfiniteScroll,
//   InfiniteScrollList,
// } from "@akashaorg/ui/lib/akasha-components/infinite-scroll";
import {
  ExtensionCard,
  ExtensionCardAction,
  ExtensionCardActionActive,
  ExtensionCardActionInactive,
  ExtensionCardAvatar,
  ExtensionCardContent,
  ExtensionCardDescription,
  ExtensionCardName,
} from '@/ui/extension-card';
import {
  ExtensionAvatar,
  ExtensionAvatarImage,
  ExtensionAvatarFallback,
} from '@/ui/extension-avatar';
import { ProfileAvatarButton, ProfileDidField, ProfileName } from '@/ui/profile-avatar-button';

import { useGetAppsQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import {
  selectAkashaApps,
  selectAkashaAppsPageInfo,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-query';
import { transformSource } from '@akashaorg/ui-core-hooks';
import { Badge } from '@akashaorg/ui/lib/components/badge';
import { X } from 'lucide-react';

type WorldConfigFormStep2Props = {
  worldId: string;
};

export const WorldConfigFormStep2Page: React.FC<WorldConfigFormStep2Props> = ({ worldId }) => {
  const { t } = useTranslation('app-extensions');

  const navigate = useNavigate();

  const handleSave = () => {
    navigate({ to: '/dashboard' });
  };
  const handleNavBack = () => {
    navigate({ to: '/world-config-form/$worldId/step1', params: { worldId } });
  };

  const {
    data: getAppsReq,
    loading: loadingGetAppsQuery,
    error: getAppsError,
    fetchMore,
  } = useGetAppsQuery({
    variables: { first: 10 },
  });

  const akashaApps = selectAkashaApps(getAppsReq);
  const pageInfo = selectAkashaAppsPageInfo(getAppsReq);

  const [selectedExtensions, setSelectedExtensions] = useState([]);

  const addExtension = ext => {
    setSelectedExtensions(prev => {
      return [...new Set([...prev, ext])];
    });
  };

  const removeExtension = extId => {
    setSelectedExtensions(prev => prev.filter(ext => ext.id === extId));
  };

  return (
    <Card>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={1} numberOfSteps={2} className="max-w-[112px]" />
        </Stack>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('Choose Your Extensions')}</Typography>
        </CardTitle>
        <CardDescription className="flex justify-start">
          <Typography variant="h6">{t('World Extensions')}</Typography>
          <Typography variant="sm">
            {t(
              'Add the extensions to be installed in your world. The order you add them here will be reflected in the sidebar.',
            )}
          </Typography>
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4">
        <Card>
          <CardContent className="bg-zinc-50">
            <InfiniteScroll
              count={akashaApps?.length}
              estimatedHeight={60}
              overScan={10}
              itemSpacing={0}
              onLoadMore={() => {
                return fetchMore({
                  variables: {
                    after: pageInfo?.endCursor,
                  },
                });
              }}
            >
              <InfiniteScrollList>
                {index => {
                  const extensionData = akashaApps[index];
                  return (
                    <ExtensionCard>
                      <ExtensionCardAvatar>
                        <ExtensionAvatar size="lg" extensionId="">
                          <ExtensionAvatarImage
                            src={transformSource(extensionData?.logoImage)?.src}
                            alt="extension logo image"
                          />
                          <ExtensionAvatarFallback />
                        </ExtensionAvatar>
                      </ExtensionCardAvatar>
                      <ExtensionCardContent>
                        <ExtensionCardName>{extensionData?.displayName}</ExtensionCardName>
                        <ProfileAvatarButton
                          size="sm"
                          profileDID={extensionData?.author?.akashaProfile?.did?.id}
                        >
                          <ProfileAvatarButton.Avatar>
                            <ProfileAvatarButton.AvatarImage
                              src={
                                transformSource(
                                  extensionData?.author?.akashaProfile?.avatar?.default,
                                ).src
                              }
                              alt="author profile avatar"
                            />
                            <ProfileAvatarButton.AvatarFallback />
                          </ProfileAvatarButton.Avatar>
                          <ProfileName>{extensionData?.author?.akashaProfile?.name}</ProfileName>
                          <ProfileDidField />
                        </ProfileAvatarButton>
                        <ExtensionCardDescription>
                          {extensionData?.description}
                        </ExtensionCardDescription>
                      </ExtensionCardContent>
                      <ExtensionCardAction active={selectedExtensions.indexOf(extensionData) > -1}>
                        <ExtensionCardActionInactive
                          onClick={() => {
                            addExtension(extensionData);
                          }}
                        >
                          {t('Add')}
                        </ExtensionCardActionInactive>
                        <ExtensionCardActionActive
                          onClick={() => {
                            removeExtension(extensionData?.id);
                          }}
                        >
                          {t('Added')}
                        </ExtensionCardActionActive>
                      </ExtensionCardAction>
                    </ExtensionCard>
                  );
                }}
              </InfiniteScrollList>
            </InfiniteScroll>
          </CardContent>
        </Card>
        <Stack direction="column" spacing={2}>
          <Typography variant="h5">{t('You have selected:')}</Typography>
          {selectedExtensions?.length === 0 && (
            <Typography variant="sm">{t('You haven’t selected any extensions yet.')}</Typography>
          )}
          {selectedExtensions?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedExtensions.map(ext => (
                <Badge key={ext?.id} variant="secondary">
                  {ext?.displayName}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-2"
                    onClick={() => removeExtension(ext?.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </Stack>
      </CardContent>
      <CardFooter>
        <Button className="px-6 h-8" variant="outline" onClick={handleNavBack}>
          {t('Back')}
        </Button>
        <Button className="px-6 h-8" onClick={handleSave}>
          {t('Save Config')}
        </Button>
      </CardFooter>
    </Card>
  );
};
