import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useAkashaStore, useRootComponentProps, withProviders } from '@akashaorg/ui-core-hooks';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { I18nextProvider, useTranslation } from 'react-i18next';
import {
  MinusIcon,
  BeakerIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { LocalReleaseData } from '@akashaorg/typings/lib/ui';

const TestModeWidget = () => {
  const [testExtensions, setTestExtensions] = useState<LocalReleaseData[]>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const { getCorePlugins, worldConfig, logger } = useRootComponentProps();
  const { t } = useTranslation();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const testModeLoaderPlugin = useRef(getCorePlugins().testModeLoader);

  useEffect(() => {
    if (!authenticatedDID) {
      setTestExtensions(null);
      return;
    }
    const sessionKey = testModeLoaderPlugin.current?.getTestSessionKey?.();
    const extensions = sessionStorage.getItem(sessionKey);
    if (extensions) {
      try {
        const ext: LocalReleaseData[] = JSON.parse(extensions);
        if (ext.length > 0) {
          // set extensions
          setTestExtensions(ext);
        }
      } catch (ex) {
        // set error
        logger.error(ex);
        setError(ex);
      }
    }
  }, [authenticatedDID, logger]);

  if (!testExtensions) {
    return null;
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const onLeave = async () => {
    await testModeLoaderPlugin.current?.unload();
    window.location.href = `${window.location.origin}/${worldConfig.homepageApp}`;
  };

  const onEdit = (applicationID: string) => () => {
    getCorePlugins().routing.navigateTo({
      appName: worldConfig.extensionsApp,
      getNavigationUrl: () => {
        return `/release-manager/${applicationID}/edit-test-release`;
      },
    });
  };

  return (
    <>
      {testExtensions.length > 0 && (
        <>
          {isMinimized && (
            <Button variant="outline" size="icon" onClick={toggleMinimize}>
              <BeakerIcon />
            </Button>
          )}
          {!isMinimized && (
            <Card className="p-4 w-full">
              <Stack direction="row" justifyContent="between" alignItems={'baseline'}>
                <Text variant="h6">{t('Testing Environment')}</Text>
                <Button variant="outline" size="icon" onClick={toggleMinimize}>
                  <MinusIcon />
                </Button>
              </Stack>
              <Stack className="my-2 rounded-xl bg-inherit bg-grey9 dark:bg-grey3">
                {error && (
                  <Text variant="subtitle2" color="error">
                    {t('Failed to load app info. Please check console for more details.')}
                  </Text>
                )}
                {testExtensions.map((ext, idx) => (
                  <Fragment key={ext.appName}>
                    <Stack
                      key={ext.appName}
                      direction="row"
                      spacing={2}
                      alignItems={'center'}
                      justifyContent="between"
                      className="p-2"
                    >
                      <Stack direction="row" alignItems={'center'} spacing={2}>
                        <AppAvatar
                          height={2.5}
                          width={2.5}
                          customStyle={'rounded-[0.375rem]'}
                          appType={ext.applicationType}
                        />
                        <Stack direction="column" alignItems="start">
                          <Text
                            variant={'button-lg'}
                            customStyle="max-w-[15ch]"
                            title={ext.appName}
                            key={ext.appName}
                            truncate={true}
                          >
                            {ext.appName}
                          </Text>
                          <Text
                            variant={'subtitle2'}
                            title={ext.source}
                            customStyle="max-w-[20ch]"
                            truncate={true}
                          >
                            {ext.source}
                          </Text>
                        </Stack>
                      </Stack>
                      <Button variant="link" onClick={onEdit(ext.applicationID)} className="pr-2">
                        {t('Edit')}
                      </Button>
                    </Stack>
                    {idx < testExtensions.length - 1 && (
                      <Divider customStyle="border-grey6 dark:border-grey5 px-2" />
                    )}
                  </Fragment>
                ))}
              </Stack>
              <Stack spacing={2}>
                <Stack spacing={2} className="md:flex-row w-full">
                  <Button onClick={() => window.location.reload()} className="w-full">
                    {t('Reload')}
                  </Button>
                </Stack>
                <Button variant="link" onClick={onLeave} className="w-full py-2">
                  {t('Leave Environment')}
                </Button>
              </Stack>
            </Card>
          )}
        </>
      )}
    </>
  );
};

const Widget = () => {
  const { getTranslationPlugin } = useRootComponentProps();
  return (
    <I18nextProvider i18n={getTranslationPlugin().i18n}>
      <TestModeWidget />
    </I18nextProvider>
  );
};

export default withProviders(Widget);
