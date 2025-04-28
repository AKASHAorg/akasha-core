import React, { useCallback, useEffect, useRef } from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { useTranslation } from 'react-i18next';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  ArrowPathIcon,
  ArrowTopRightOnSquareIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { useNavigate } from '@tanstack/react-router';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Checkbox } from '@akashaorg/ui/lib/components/checkbox';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import {
  AkashaAppApplicationType,
  AppImageSource,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-core-hooks/lib/generated';
import getSDK from '@akashaorg/core-sdk';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderFooter,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import {
  selectAkashaApp,
  selectAppDisplayName,
  selectAppLogoImage,
  selectPublisherName,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-by-publisher-did-query';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';

enum TermsFields {
  PRIVACY_POLICY = 'privacyPolicy',
  TERMS_OF_USE = 'termsOfUse',
  CODE_OF_CONDUCT = 'codeOfConduct',
  DISCLAIMERS = 'disclaimers',
}

const TermsLinks = {
  [TermsFields.PRIVACY_POLICY]: '/@akashaorg/app-legal/privacy-policy',
  [TermsFields.TERMS_OF_USE]: '/@akashaorg/app-legal/terms-of-use',
  [TermsFields.CODE_OF_CONDUCT]: '/@akashaorg/app-legal/code-of-conduct',
  [TermsFields.DISCLAIMERS]: '#',
};

type AcceptedTerms = {
  [TermsFields.PRIVACY_POLICY]: boolean;
  [TermsFields.TERMS_OF_USE]: boolean;
  [TermsFields.CODE_OF_CONDUCT]: boolean;
  [TermsFields.DISCLAIMERS]: boolean;
};

export const ExtensionInstallTerms = ({ appId }: { appId: string }) => {
  const { decodeAppName, getCorePlugins, uiEvents } = useRootComponentProps();
  const decodeName = useRef(decodeAppName);

  const installerPlugin = getCorePlugins().extensionInstaller;

  const idxDid = getSDK().services.gql.indexingDID;

  const {
    data: appInfo,
    loading: loadingAppInfo,
    called: appInfoQueryCalled,
    error: appInfoQueryError,
  } = useGetAppsByPublisherDidQuery({
    variables: {
      id: idxDid,
      first: 1,
      filters: { where: { name: { equalTo: decodeName.current(appId) } } },
      sorting: { createdAt: SortOrder.Desc },
    },
  });

  const {
    data: { authenticatedDID, isAuthenticating },
  } = useAkashaStore();

  useEffect(() => { }, []);

  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = React.useState<AcceptedTerms>({
    [TermsFields.PRIVACY_POLICY]: false,
    [TermsFields.TERMS_OF_USE]: false,
    [TermsFields.CODE_OF_CONDUCT]: false,
    [TermsFields.DISCLAIMERS]: false,
  });

  const { t } = useTranslation();

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setAcceptedTerms(prev => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleLoginClick = useCallback(() => {
    getCorePlugins().routing.navigateTo({
      appName: '@akashaorg/app-auth-ewa',
      getNavigationUrl: (appRoutes: Record<string, string>) => {
        return `${appRoutes.Connect}?${new URLSearchParams({
          redirectTo: location.pathname,
        })}`;
      },
    });
  }, [getCorePlugins]);

  const handleContinue = async () => {
    if (!allTermsAccepted) return;

    await installerPlugin.acceptUserAgreement(selectAkashaApp(appInfo));

    await navigate({
      to: '/install/$appId/progress',
      params: { appId },
      replace: true,
    });
  };

  const handleCancel = () => {
    navigate({
      to: `/info/$appId`,
      params: { appId },
      replace: true,
    }).catch(err => console.error('Failed to navigate!', err));

    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title: t('Installation cancelled'),
      },
    });
  };

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

  const fieldLabels = {
    [TermsFields.PRIVACY_POLICY]: t('Privacy Policy'),
    [TermsFields.TERMS_OF_USE]: t('Terms of Use'),
    [TermsFields.CODE_OF_CONDUCT]: t('Code of Conduct'),
    [TermsFields.DISCLAIMERS]: t('Disclaimers'),
  };

  const isAppInfoLoading = loadingAppInfo && appInfoQueryCalled;
  if (isAuthenticating) {
    return null;
  }

  if (!authenticatedDID && !isAuthenticating) {
    const appDisplayName = isAppInfoLoading ? t('this app') : selectAppDisplayName(appInfo);
    return (
      <ErrorLoader type="not-authenticated">
        <ErrorLoaderTitle>{t('Login Required')}</ErrorLoaderTitle>
        <ErrorLoaderDescription>
          {t('You must be logged in to install {{appDisplayName}}', {
            appDisplayName,
          })}
        </ErrorLoaderDescription>
        <ErrorLoaderFooter>
          <Button onClick={handleLoginClick}>{t('Login')}</Button>
        </ErrorLoaderFooter>
      </ErrorLoader>
    );
  }

  if (appInfoQueryError) {
    return (
      <ErrorLoader type="no-apps">
        <ErrorLoaderTitle>{t('Oops, failed to get extension info')}</ErrorLoaderTitle>
        <ErrorLoaderDescription>
          {t('This error means we cannot get extension information at this moment.')}
        </ErrorLoaderDescription>
      </ErrorLoader>
    );
  }

  return (
    <Card className="p-0">
      <TermsHeader
        isLoading={isAppInfoLoading}
        appDisplayName={selectAppDisplayName(appInfo)}
        appPublisher={selectPublisherName(appInfo)}
        appLogo={selectAppLogoImage(appInfo)}
      />
      <Divider />
      <Text variant="subtitle2" selectable={false} customStyle="m-4">
        {t('I agree to:')}
      </Text>
      <Stack direction="column" spacing={4} className="mx-4 mb-4">
        {Object.keys(acceptedTerms).map(stateKey => (
          <Stack direction="row" spacing={2} key={stateKey} alignItems={'center'}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Checkbox
                id={stateKey}
                name={stateKey}
                value={'value'}
                onCheckedChange={checked => handleCheckboxChange(stateKey, checked as boolean)}
                checked={acceptedTerms[stateKey]}
              />
              <label htmlFor={stateKey}>
                <Typography variant="sm">{fieldLabels[stateKey]}</Typography>
              </label>
            </Stack>
            <a
              href={TermsLinks[stateKey]}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5"
            >
              <Icon
                customStyle="[&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark"
                icon={<ArrowTopRightOnSquareIcon />}
              />
            </a>
          </Stack>
        ))}
      </Stack>
      <Divider />
      <Stack justifyContent="between" spacing={4} className="flex-column md:flex-row-reverse p-4">
        <Button disabled={!allTermsAccepted} onClick={handleContinue}>
          {t('Continue')}
        </Button>
        <Button variant="link" onClick={handleCancel}>
          {t('Cancel installation')}
        </Button>
      </Stack>
    </Card>
  );
};

const TermsHeader = ({
  appDisplayName,
  appPublisher,
  appLogo,
  isLoading,
}: {
  appDisplayName: string;
  appPublisher: string;
  appLogo?: AppImageSource;
  isLoading: boolean;
}) => {
  const { t } = useTranslation();
  return (
    <Stack className="p-3">
      <Text variant="h5">{t('User Agreement')}</Text>
      <Stack direction="row" spacing={2} alignItems="center" className="mt-3">
        {isLoading && <Icon icon={<ArrowPathIcon />} />}
        {!isLoading && (
          <AppAvatar
            customStyle="w-10 h-10 cursor-default"
            appType={AkashaAppApplicationType.App}
            avatar={appLogo}
          />
        )}
        <Stack direction="column" justifyContent="between">
          {isLoading && (
            <Text variant="button-sm" selectable={false}>
              {t('Loading extension info...')}
            </Text>
          )}
          {!isLoading && (
            <>
              <Text variant="button-md" selectable={false}>
                {appDisplayName}
              </Text>
              <Text
                variant="footnotes2"
                color={{ light: 'grey7', dark: 'grey4' }}
                customStyle="max-w-[35ch] sm:max-w-full truncate"
                selectable={false}
              >
                {appPublisher}
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
