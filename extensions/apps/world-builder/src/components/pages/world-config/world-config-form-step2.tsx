import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Stepper } from '@akashaorg/ui/lib/akasha-components/stepper';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@akashaorg/ui/lib/components/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@akashaorg/ui/lib/akasha-components/card';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  InfiniteScroll,
  InfiniteScrollList,
} from '@akashaorg/ui/lib/akasha-components/infinite-scroll';
import {
  ExtensionCard,
  ExtensionCardAction,
  ExtensionCardActionActive,
  ExtensionCardActionInactive,
  ExtensionCardAvatar,
  ExtensionCardAvatarFallback,
  ExtensionCardAvatarImage,
  ExtensionCardContent,
  ExtensionCardDescription,
  ExtensionCardName,
} from '@/ui/extension-card';
import {
  ProfileAvatarButton,
  ProfileAvatarButtonAvatar,
  ProfileAvatarButtonAvatarFallback,
  ProfileAvatarButtonAvatarImage,
  ProfileDidField,
  ProfileName,
} from '@/ui/profile-avatar-button';
import {
  useCreateAkashaWorldConfigExtensionMutation,
  useCreateAkashaWorldConfigMutation,
  useGetAppsQuery,
  useGetWorldByIdQuery,
  useGetWorldConfigQuery,
  useDeleteAkashaWorldConfigExtensionMutation,
} from '@akashaorg/ui-core-hooks/lib/generated';
import {
  selectAkashaApps,
  selectAkashaAppsPageInfo,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-query';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { Badge } from '@akashaorg/ui/lib/akasha-components/badge';
import { X } from 'lucide-react';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import getSDK from '@akashaorg/core-sdk';
import { selectWorldData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-by-id-query';
import { selectWorldConfigData } from '@akashaorg/ui-core-hooks/lib/selectors/get-world-config-query';
import { Separator } from '@akashaorg/ui/lib/components/separator';

type WorldConfigFormStep2Props = {
  worldId: string;
};

export const WorldConfigFormStep2Page: React.FC<WorldConfigFormStep2Props> = ({ worldId }) => {
  const { t } = useTranslation('app-extensions');

  const navigate = useNavigate();
  const { uiEvents } = useRootComponentProps();
  const sdk = React.useRef(getSDK());

  const uiEventsRef = React.useRef(uiEvents);

  const showErrorNotification = React.useCallback((title: string, errorMessage?: string) => {
    uiEventsRef.current.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title,
        description: errorMessage,
      },
    });
  }, []);

  const formValue = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem(worldId)) || {};
    } catch (error) {
      showErrorNotification(error);
    }
  }, [worldId, showErrorNotification]);

  const {
    data: getWorldByIdReq,
    loading: loadingWorldByIdQuery,
    error: getWorldByIdError,
  } = useGetWorldByIdQuery({
    variables: {
      id: worldId,
    },
  });

  const worldData = selectWorldData(getWorldByIdReq);

  const {
    data: worldConfigReq,
    loading: loadingWorldConfigQuery,
    error: worldConfigError,
  } = useGetWorldConfigQuery({
    variables: { worldID: worldData?.id },
    skip: !worldData?.id,
  });

  const worldConfig = selectWorldConfigData(worldConfigReq);

  const {
    data: getAppsReq,
    loading: loadingGetAppsQuery,
    error: getAppsError,
    fetchMore,
  } = useGetAppsQuery({
    variables: {
      first: 10,
    },
  });

  const akashaApps = selectAkashaApps(getAppsReq);
  const pageInfo = selectAkashaAppsPageInfo(getAppsReq);

  const [selectedExtensions, setSelectedExtensions] = useState([]);

  // if there is already a configuration for this world prefill the extensions in the UI
  useEffect(() => {
    if (worldConfig?.extensions?.edges?.length > 0) {
      const extensions = worldConfig.extensions.edges?.map(extNode => {
        const extData = extNode?.node;
        return {
          id: extData.extensionID,
          ...extData.extension,
        };
      });
      setSelectedExtensions(prev => {
        return [...new Set([...prev, ...extensions])];
      });
    }
  }, [worldConfig?.extensions]);

  const addExtension = ext => {
    setSelectedExtensions(prev => {
      return [...new Set([...prev, ext])];
    });
  };

  const removeExtension = extId => {
    setSelectedExtensions(prev =>
      prev.filter(ext => {
        return ext.id !== extId;
      }),
    );
  };

  const [homepage, setHomepage] = useState(null);

  const [
    createWorldConfigExtensionMutation,
    { loading: loadingWorldConfigCreateExtensionMutation },
  ] = useCreateAkashaWorldConfigExtensionMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onError: error => {
      showErrorNotification(
        `${t(`Something went wrong when creating the world configuration extensions`)}.`,
        error.message,
      );
    },
  });

  const [
    deleteWorldConfigExtensionMutation,
    { loading: loadingWorldConfigUpdateExtensionMutation },
  ] = useDeleteAkashaWorldConfigExtensionMutation({
    context: { source: sdk.current.services.gql.contextSources.composeDB },
    onError: error => {
      showErrorNotification(
        `${t(`Something went wrong when deleting the world configuration extension`)}.`,
        error.message,
      );
    },
  });

  const getUniqueExtensionsData = (worldConfigId: string) => {
    const selectedExtensionsIDs = new Set(
      selectedExtensions
        ?.map(ext => ext.id)
        .concat([formValue?.layoutExtension, formValue?.registryExtension]),
    );

    const oldExtensionsIDs = new Set(
      worldConfig?.extensions?.edges?.map(ext => ext.node?.extensionID),
    );

    const newExtensionsIDs = selectedExtensionsIDs.difference(oldExtensionsIDs);

    const oldExtensionsToBeRemovedSet = oldExtensionsIDs.difference(selectedExtensionsIDs);

    const newExtensionsData = [...newExtensionsIDs].map(extensionID => {
      const createdAt = worldConfig?.extensions.edges?.find(
        extData => extData?.node?.extensionID === extensionID,
      )?.node?.createdAt;
      const worldConfigExtensionData = {
        worldConfigID: worldConfigId,
        extensionID: extensionID,
        active: true,
        createdAt: createdAt ?? new Date().toISOString(),
      };
      return worldConfigExtensionData;
    });

    const oldExtensionsData = worldConfig?.extensions?.edges?.map(ext => ext.node);

    const extensionsToBeRemovedIds = [...oldExtensionsToBeRemovedSet].map(extensionID => {
      const extData = oldExtensionsData?.find(ext => ext?.extensionID === extensionID);
      if (extData) {
        return extData.id;
      }
    });

    return { newExtensionsData, extensionsToBeRemovedIds };
  };

  const createExtensions = (worldConfigId: string) => {
    const extensions = getUniqueExtensionsData(worldConfigId)?.newExtensionsData;
    return Promise.all(
      extensions.map(extData =>
        createWorldConfigExtensionMutation({
          variables: {
            i: {
              content: extData,
            },
          },
        }),
      ),
    );
  };

  const deleteExtensions = (worldConfigId: string) => {
    const extensions = getUniqueExtensionsData(worldConfigId)?.extensionsToBeRemovedIds;
    return Promise.all(
      extensions.map(extData =>
        deleteWorldConfigExtensionMutation({
          variables: {
            i: {
              id: extData,
              shouldIndex: false,
            },
          },
        }),
      ),
    );
  };

  const navToConfigSuccessPage = () => {
    navigate({
      to: '/config-success',
      search: {
        worldId: worldId,
        worldName: worldData?.name,
      },
    });
  };

  const [createWorldConfigMutation, { loading: loadingWorldConfigMutation }] =
    useCreateAkashaWorldConfigMutation({
      context: { source: sdk.current.services.gql.contextSources.composeDB },
      onCompleted: async data => {
        const worldConfigId = data?.setAkashaWorldConfig?.document?.id;
        await createExtensions(worldConfigId);
        await deleteExtensions(worldConfigId);
        navToConfigSuccessPage();
      },
      onError: error => {
        showErrorNotification(
          `${t(`Something went wrong when creating the world configuration`)}.`,
          error.message,
        );
      },
    });

  const handleSave = () => {
    const worldConfigData = {
      layoutExtension: formValue?.layoutExtension,
      registryExtension: formValue?.registryExtension,
      homepageExtension: homepage || worldConfig?.homepageExtension,
      worldID: worldId,
      active: true,
      createdAt: worldConfig?.createdAt ?? new Date().toISOString(),
    };
    createWorldConfigMutation({
      variables: {
        i: {
          content: worldConfigData,
        },
      },
    });
  };
  const handleNavBack = () => {
    navigate({ to: '/world-config-form/$worldId/step1', params: { worldId } });
  };

  return (
    <>
      <CardHeader>
        <Stack className="items-center">
          <Stepper currentStep={1} numberOfSteps={2} className="max-w-[112px]" />
        </Stack>
        <CardTitle className="text-center">
          <Typography variant="h5">{t('Choose Your Extensions')}</Typography>
        </CardTitle>
        <CardDescription className="flex flex-col justify-start text-left">
          <Typography variant="h6">{t('World Extensions')}</Typography>
          <Typography variant="sm">
            {t(
              'Add the extensions to be installed in your world. The order you add them here will be reflected in the sidebar.',
            )}
          </Typography>
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        <Card className="p-0 h-[30rem] **:data-[slot=infinite-scroll-container]:h-full bg-nested-card">
          <InfiniteScroll
            count={akashaApps?.length}
            estimatedHeight={60}
            overScan={10}
            loading={loadingGetAppsQuery}
            scrollElementType="element"
            hasNextPage={pageInfo && pageInfo.hasNextPage}
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
                  <>
                    <ExtensionCard className="p-4">
                      <ExtensionCardAvatar size="lg" extensionId={extensionData?.id}>
                        <ExtensionCardAvatarImage
                          src={transformSource(extensionData?.logoImage)?.src}
                        >
                          <ExtensionCardAvatarFallback />
                        </ExtensionCardAvatarImage>
                      </ExtensionCardAvatar>
                      <ExtensionCardContent>
                        <ExtensionCardName>{extensionData?.displayName}</ExtensionCardName>
                        <ProfileAvatarButton
                          size="sm"
                          profileDID={extensionData?.author?.akashaProfile?.did?.id}
                        >
                          <ProfileAvatarButtonAvatar>
                            <ProfileAvatarButtonAvatarImage
                              src={
                                transformSource(
                                  extensionData?.author?.akashaProfile?.avatar?.default,
                                )?.src
                              }
                            />
                            <ProfileAvatarButtonAvatarFallback />
                          </ProfileAvatarButtonAvatar>
                          <ProfileName>{extensionData?.author?.akashaProfile?.name}</ProfileName>
                          <ProfileDidField />
                        </ProfileAvatarButton>
                        <ExtensionCardDescription>
                          {extensionData?.description}
                        </ExtensionCardDescription>
                      </ExtensionCardContent>
                      <ExtensionCardAction
                        active={
                          selectedExtensions.findIndex(
                            selectedExtData => selectedExtData?.id === extensionData?.id,
                          ) > -1
                        }
                      >
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
                    {index < akashaApps?.length - 1 && (
                      <Stack className="px-4">
                        <Separator />
                      </Stack>
                    )}
                  </>
                );
              }}
            </InfiniteScrollList>
          </InfiniteScroll>
        </Card>
        <Stack direction="column" spacing={2}>
          <Typography variant="h6">{t('You have selected:')}</Typography>
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
        <Stack direction="column" spacing={4}>
          <Typography variant="h6">{t('Homepage')}</Typography>
          <Typography variant="sm">
            {t(
              'Selecting an extension sets it as the default homepage when members enter the world.',
            )}
          </Typography>
          <Select
            onValueChange={setHomepage}
            disabled={!selectedExtensions?.length}
            value={homepage || worldConfig?.homepageExtension}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={t('Choose a homepage')} />
            </SelectTrigger>
            <SelectContent>
              {selectedExtensions?.length > 0 &&
                selectedExtensions?.map(ext => (
                  <SelectItem key={ext.id} value={ext.id}>
                    {ext.displayName}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </Stack>
      </CardContent>
      <CardFooter>
        <Button className="px-6" variant="outline" onClick={handleNavBack}>
          {t('Back')}
        </Button>
        <Button
          className="px-6"
          onClick={handleSave}
          loading={loadingWorldConfigMutation || loadingWorldConfigCreateExtensionMutation}
        >
          {t('Save Config')}
        </Button>
      </CardFooter>
    </>
  );
};
