import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import singleSpaReact from 'single-spa-react';
import { withProviders } from '@akashaproject/ui-awf-hooks';
import DS from '@akashaproject/design-system';
import { useNetworkState } from '@akashaproject/ui-awf-hooks/lib/use-network-state.new';
import {
  UsernameTypes,
  ProfileProviders,
  IProfileData,
  ProfileProviderProperties,
} from '@akashaproject/ui-awf-typings/lib/profile';
import { TFunction, useTranslation } from 'react-i18next';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import {
  ENSOptionTypes,
  EnsFormOption,
} from '@akashaproject/design-system/lib/components/EnsFormCard';
import {
  useUpdateUsernameProvider,
  useEnsRegistration,
  useEnsByAddress,
} from '@akashaproject/ui-awf-hooks/lib/use-username.new';
import { useGetLogin } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import { DataProviderInput } from '@akashaproject/awf-sdk/typings/lib/interfaces/common';

const {
  ErrorLoader,
  ThemeSelector,
  lightTheme,
  darkTheme,
  // styled,
  EnsFormCard,
  ModalContainer,
  BasicCardBox,
  Box,
  Text,
  Spinner,
  Icon,
} = DS;

// const ENSForm = styled(EnsFormCard)`
//   max-width: 100%;
//   max-height: 100vh;
//   overflow: auto;
//   min-height: 100vh;
//   @media screen and (min-width: ${props => props.theme.breakpoints.medium.value}px) {
//     max-width: 66%;
//     max-height: 75%;
//     min-height: max-content;
//   }
//   @media screen and (min-width: ${props => props.theme.breakpoints.large.value}px) {
//     max-width: 50%;
//     min-height: max-content;
//   }
//   @media screen and (min-width: ${props => props.theme.breakpoints.xlarge.value}px) {
//     max-width: 33%;
//     min-height: max-content;
//   }
// `;

const getUsernameTypes = (profileData: IProfileData) => {
  const types: UsernameTypes[] = [];
  if (!profileData) {
    return { available: types };
  }
  const defaultProvider = profileData.default?.find(
    p => p.property === ProfileProviderProperties.USERNAME,
  );

  if (profileData.providers.length) {
    profileData.providers.forEach(provider => {
      if (provider.property === ProfileProviderProperties.USERNAME) {
        if (provider.provider === ProfileProviders.ENS) {
          if (provider.value.endsWith('.akasha.eth')) {
            types.push(UsernameTypes.AKASHA_ENS_SUBDOMAIN);
          } else if (provider.value.endsWith('.eth')) {
            types.push(UsernameTypes.ENS_DOMAIN);
          }
        }
        if (provider.provider === ProfileProviders.EWA_BASIC) {
          types.push(UsernameTypes.TEXTILE);
        }
      }
    });
    return {
      default: defaultProvider,
      available: types,
    };
  }
};

const getEnsFormOptions = (
  usernameTypes: { default?: DataProviderInput; available: UsernameTypes[] },
  ens: string,
  profileData: IProfileData,
  t: TFunction,
) => {
  const options: EnsFormOption[] = [];
  const hasEnsSubdomainAvail = usernameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN);
  const hasEnsDomainAvail = usernameTypes.available.includes(UsernameTypes.ENS_DOMAIN);
  const currentDefault = usernameTypes.default;

  /**
   * Show akasha subdomain option if it's not using ens domain
   */

  if (
    hasEnsSubdomainAvail ||
    (ens && ens.endsWith('.akasha.eth')) ||
    currentDefault?.provider === ProfileProviders.ENS ||
    currentDefault?.provider === ProfileProviders.EWA_BASIC
  ) {
    options.push({
      type: ENSOptionTypes.ENS_AKASHA_SUBDOMAIN,
      label: usernameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)
        ? t('Display my AKASHA Ethereum name')
        : t('Use an AKASHA-provided Ethereum name'),
      value: `${profileData.userName}.akasha.eth`,
      defaultChecked: !options.length,
      textDetails: usernameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ? (
        <></>
      ) : (
        <>
          {t('Username Powered by')}{' '}
          <Icon
            type="appEns"
            size="xs"
            wrapperStyle={{ display: 'inline', verticalAlign: 'middle' }}
          />{' '}
          <strong>ENS</strong>. {t('You will need to pay gas fees to register this Ethereum name.')}
        </>
      ),
    });
  }
  /**
   * Show ens domain options if we detect one and it's not already set
   */
  if (
    hasEnsDomainAvail ||
    (!usernameTypes.default?.value.endsWith('.eth') && ens && !ens.endsWith('.akasha.eth'))
  ) {
    options.push({
      type: ENSOptionTypes.BRING_YOUR_OWN_ENS,
      label: t('Use my own Ethereum name'),
      value: ens,
      defaultChecked: !options.length,
    });
  }
  /**
   * Show ethAddress option if the user aready have akasha subdomain or ens domain
   */
  if (hasEnsSubdomainAvail || hasEnsDomainAvail) {
    options.push({
      type: ENSOptionTypes.ETH_ADDRESS,
      label: t('Display only my Ethereum address'),
      value: profileData.ethAddress as string,
      defaultChecked: !options.length,
    });
  }
  return options;
};

const UpdateENSModal: React.FC<RootComponentProps> = props => {
  const { navigateToModal, activeModal } = props;
  const loginQuery = useGetLogin();
  const checkNetworkReq = useNetworkState(loginQuery.data.isReady);
  const profileDataQuery = useGetProfile(loginQuery.data.pubKey);
  const ensByAddress = useEnsByAddress(loginQuery.data.ethAddress);
  const updateUsernameProviderQuery = useUpdateUsernameProvider(loginQuery.data.pubKey);
  const registerEnsQuery = useEnsRegistration();
  const { t } = useTranslation();

  const userNameTypes = React.useMemo(() => {
    if (profileDataQuery.status === 'success') {
      return getUsernameTypes(profileDataQuery.data);
    }
    return { available: [] };
  }, [profileDataQuery.data, profileDataQuery.status]);
  const ensFormOptions: EnsFormOption[] = React.useMemo(() => {
    if (
      profileDataQuery.status === 'success' &&
      loginQuery.data.isReady &&
      ensByAddress.status === 'success'
    ) {
      return getEnsFormOptions(userNameTypes, ensByAddress.data, profileDataQuery.data, t);
    }
    return [];
  }, [
    profileDataQuery.status,
    profileDataQuery.data,
    loginQuery.data,
    ensByAddress.status,
    ensByAddress.data,
    userNameTypes,
    t,
  ]);

  React.useEffect(() => {
    if (loginQuery.data.fromCache && !loginQuery.data.ethAddress) {
      /* User is not logged in. */
      navigateToModal({
        name: 'signin',
        redirectTo: activeModal,
      });
    }
  }, [loginQuery.data, navigateToModal, activeModal]);

  const handleModalClose = React.useCallback(() => {
    props.singleSpa.navigateToUrl(location.pathname);
  }, [props.singleSpa]);

  React.useEffect(() => {
    if (updateUsernameProviderQuery.status === 'success') {
      handleModalClose();
    }
    if (registerEnsQuery.status === 'success') {
      handleModalClose();
    }
  }, [updateUsernameProviderQuery, registerEnsQuery, handleModalClose]);

  const handleEnsSubmit = (option: EnsFormOption) => {
    let selectedOption: EnsFormOption | undefined = option;

    if (!selectedOption) {
      selectedOption = ensFormOptions.find(option => option.defaultChecked);
    }

    if (!selectedOption) {
      props.logger.error('Selected option is undefined!');
      return;
    }
    switch (selectedOption.type) {
      case ENSOptionTypes.ENS_AKASHA_SUBDOMAIN:
        if (userNameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)) {
          updateUsernameProviderQuery.mutate({
            provider: ProfileProviders.ENS,
            userName: selectedOption.value,
          });
        } else {
          registerEnsQuery.mutate({
            userName: selectedOption.value,
          });
        }
        break;
      case ENSOptionTypes.BRING_YOUR_OWN_ENS:
        updateUsernameProviderQuery.mutate({
          userName: selectedOption.value,
          provider: ProfileProviders.ENS,
        });
        break;
      case ENSOptionTypes.ETH_ADDRESS:
        updateUsernameProviderQuery.mutate({
          provider: ProfileProviders.EWA_BASIC,
          userName: '',
        });
        break;
      default:
        props.logger.error('Unknown option type!');
    }
  };

  return (
    <ModalContainer>
      {!loginQuery.data.isReady && (
        <BasicCardBox pad="medium">
          <Box pad="large" align="center">
            <Text size="medium" color="grey">
              {`${t('Loading profile')}... ${t('Please wait')}.`}
            </Text>
          </Box>
          <Spinner size={24} />
        </BasicCardBox>
      )}
      {loginQuery.data.isReady && profileDataQuery.status === 'loading' && (
        <BasicCardBox pad="medium">
          <Box pad="medium" align="center">
            <Text size="medium" color="grey">
              {`${t('Loading profile data')}... ${t('Please wait')}.`}
            </Text>
          </Box>
          <Spinner size={24} />;
        </BasicCardBox>
      )}
      {checkNetworkReq.status === 'loading' && (
        <BasicCardBox pad="medium">
          <Box pad="medium" align="center">
            <Text size="medium" color="grey">
              {`${t('Checking network requirements')}... ${t('Please wait')}.`}
            </Text>
          </Box>
          <Spinner size={24} />;
        </BasicCardBox>
      )}
      {checkNetworkReq.status === 'error' && (
        <BasicCardBox pad="medium">
          <Box pad="medium" align="center">
            <Text size="medium" color="red">
              {`${t('There was an error checking network requirements')}.`}
            </Text>
          </Box>
        </BasicCardBox>
      )}
      {checkNetworkReq.status === 'success' && (
        <>
          {checkNetworkReq.data.networkNotSupported && (
            <BasicCardBox pad="medium">
              <Box pad="medium" align="center">
                <Text size="medium" color="red">
                  {`${t('Your network is not supported')}. ${t(
                    'Please switch to the Rinkeby network and refresh the page',
                  )}.`}
                </Text>
              </Box>
            </BasicCardBox>
          )}
          {!checkNetworkReq.data.networkNotSupported &&
            profileDataQuery.status === 'success' &&
            loginQuery.data.isReady && (
              <EnsFormCard
                titleLabel={
                  userNameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ||
                  userNameTypes.available.includes(UsernameTypes.ENS_DOMAIN)
                    ? t('Manage Ethereum name')
                    : t('Add an Ethereum name')
                }
                nameLabel={t('Choose Ethereum name')}
                errorLabel={t(
                  'Sorry, this username has already been taken. Please choose another one',
                )}
                options={ensFormOptions}
                cancelLabel={t('Cancel')}
                saveLabel={t('Save')}
                onSave={handleEnsSubmit}
                onCancel={handleModalClose}
                saving={
                  updateUsernameProviderQuery.status === 'loading' ||
                  registerEnsQuery.status === 'loading'
                }
                errorMessage={
                  updateUsernameProviderQuery.error?.message || registerEnsQuery.error?.message
                }
              />
            )}
        </>
      )}
    </ModalContainer>
  );
};

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: withProviders(UpdateENSModal),
  errorBoundary: (error, errorInfo, props: RootComponentProps) => {
    if (props.logger) {
      props.logger.error(`${JSON.stringify(error)}, ${errorInfo}`);
    }
    return (
      <ThemeSelector
        availableThemes={[lightTheme, darkTheme]}
        settings={{ activeTheme: 'LightTheme' }}
      >
        <ErrorLoader
          type="script-error"
          title="Error in update ens modal"
          details={error.message}
        />
      </ThemeSelector>
    );
  },
});

export const bootstrap = reactLifecycles.bootstrap;

export const mount = reactLifecycles.mount;

export const unmount = reactLifecycles.unmount;
