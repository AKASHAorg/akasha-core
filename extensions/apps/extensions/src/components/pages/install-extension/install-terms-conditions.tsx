import React, { ChangeEvent, useCallback, useEffect, useRef } from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import { useTranslation } from 'react-i18next';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { ArrowTopRightOnSquareIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { useNavigate } from '@tanstack/react-router';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import {
  AkashaAppApplicationType,
  AkashaAppEdge,
  AppImageSource,
  SortOrder,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated';
import getSDK from '@akashaorg/core-sdk';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import { GetAppsByPublisherDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

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

const isEdgeList = (
  resp: GetAppsByPublisherDidQuery,
): resp is { node: { akashaAppList: { edges: AkashaAppEdge[] } } } => {
  return (
    resp?.node !== undefined &&
    'akashaAppList' in resp.node &&
    resp?.node.akashaAppList.edges !== undefined &&
    Array.isArray(resp?.node.akashaAppList.edges)
  );
};

const selectAppDisplayName = (respData: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(respData)) {
    return respData?.node?.akashaAppList.edges[0]?.node.displayName;
  }
};

const selectAppPublisher = (respData: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(respData)) {
    return respData?.node?.akashaAppList.edges[0]?.node.author;
  }
};

const selectPublisherName = (data: GetAppsByPublisherDidQuery) => {
  const author = selectAppPublisher(data);
  if (!author) {
    return 'Unknown';
  }
  if (author.akashaProfile) {
    return author.akashaProfile.name;
  }
  return author.id;
};

const selectAppLogoImage = (data: GetAppsByPublisherDidQuery) => {
  if (isEdgeList(data)) {
    const firstEdge = data.node.akashaAppList.edges[0];
    if (firstEdge?.node.logoImage) {
      return firstEdge.node.logoImage;
    }
    return null;
  }
  return null;
};

export const ExtensionInstallTerms = ({ appId }: { appId: string }) => {
  const { decodeAppName, getCorePlugins } = useRootComponentProps();
  const decodeName = useRef(decodeAppName);

  const idxDid = getSDK().services.gql.indexingDID;

  const { data, loading, called, error } = useGetAppsByPublisherDidQuery({
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

  useEffect(() => {}, []);

  const navigate = useNavigate();
  const [acceptedTerms, setAcceptedTerms] = React.useState<AcceptedTerms>({
    [TermsFields.PRIVACY_POLICY]: false,
    [TermsFields.TERMS_OF_USE]: false,
    [TermsFields.CODE_OF_CONDUCT]: false,
    [TermsFields.DISCLAIMERS]: false,
  });

  const { t } = useTranslation();

  const handleCheckboxChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = ev.target;
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

  const handleContinue = () => {
    if (!allTermsAccepted) return;
    navigate({
      to: '/install/$appId/progress',
      params: { appId },
      replace: true,
    }).catch(err => console.error('Failed to navigate!', err));
  };

  const handleCancel = () => {
    navigate({
      to: `/info/$appId`,
      params: { appId },
      replace: true,
    }).catch(err => console.error('Failed to navigate!', err));
  };

  const allTermsAccepted = Object.values(acceptedTerms).every(Boolean);

  const fieldLabels = {
    [TermsFields.PRIVACY_POLICY]: t('Privacy Policy'),
    [TermsFields.TERMS_OF_USE]: t('Terms of Use'),
    [TermsFields.CODE_OF_CONDUCT]: t('Code of Conduct'),
    [TermsFields.DISCLAIMERS]: t('Disclaimers'),
  };

  console.log(data, 'app data');

  if (!authenticatedDID && !isAuthenticating && called && !loading) {
    return (
      <ErrorLoader
        type="not-authenticated"
        title={t('Login Required')}
        details={t('You must be logged in to install {{appDisplayName}}', {
          appDisplayName: selectAppDisplayName(data),
        })}
      >
        <Button label={t('Login')} onClick={handleLoginClick} />
      </ErrorLoader>
    );
  }

  return (
    <Card padding="p-0">
      <TermsHeader
        appDisplayName={selectAppDisplayName(data)}
        appPublisher={selectPublisherName(data)}
        appLogo={selectAppLogoImage(data)}
      />
      <Divider />
      <Text variant="subtitle2" selectable={false} customStyle="m-4">
        {t('I agree to:')}
      </Text>
      <Stack direction="column" spacing="gap-y-4" customStyle="mx-4 mb-4">
        {Object.keys(acceptedTerms).map(stateKey => (
          <Stack direction="row" spacing="gap-x-2" key={stateKey} align={'center'}>
            <Checkbox
              key={stateKey}
              id={stateKey}
              isSelected={acceptedTerms[stateKey]}
              name={stateKey}
              label={fieldLabels[stateKey]}
              handleChange={handleCheckboxChange}
              value={'unknown'}
              customStyle={'gap-x-3'}
            />
            <a
              href={TermsLinks[stateKey]}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5"
            >
              <Icon
                color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                icon={<ArrowTopRightOnSquareIcon />}
              />
            </a>
          </Stack>
        ))}
      </Stack>
      <Divider />
      <Stack
        customStyle="flex-column md:flex-row-reverse"
        justify="between"
        spacing="gap-y-4"
        padding="p-4"
      >
        <Button
          variant={'primary'}
          label={t('Continue')}
          disabled={!allTermsAccepted}
          onClick={handleContinue}
        />
        <Button variant="text" label={t('Cancel installation')} onClick={handleCancel} />
      </Stack>
    </Card>
  );
};

const TermsHeader = ({
  appDisplayName,
  appPublisher,
  appLogo,
}: {
  appDisplayName: string;
  appPublisher: string;
  appLogo?: AppImageSource;
}) => {
  const { t } = useTranslation();
  return (
    <Stack padding="p-4">
      <Text variant="h5">{t('User Agreement')}</Text>
      <Stack direction="row" spacing="gap-x-2" customStyle="mt-3">
        <AppAvatar
          customStyle="w-10 h-10"
          appType={AkashaAppApplicationType.App}
          avatar={appLogo}
        />
        <Stack direction="column" justify="between">
          <Text variant="button-md">{appDisplayName}</Text>
          <Text variant="footnotes2" customStyle="max-w-[35ch] sm:max-w-full truncate">
            {appPublisher}
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};
