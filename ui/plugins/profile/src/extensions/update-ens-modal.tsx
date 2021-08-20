import * as React from 'react';
import ReactDOM from 'react-dom';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import singleSpaReact from 'single-spa-react';
import { useLoginState, withProviders } from '@akashaproject/ui-awf-hooks';
import DS from '@akashaproject/design-system';
import { useNetworkState } from '@akashaproject/ui-awf-hooks/lib/use-network-state.new';
import { UsernameTypes, ProfileProviders } from '@akashaproject/ui-awf-typings/lib/profile';
import { useTranslation } from 'react-i18next';
import { useGetProfile } from '@akashaproject/ui-awf-hooks/lib/use-profile.new';
import {
  ENSOptionTypes,
  EnsFormOption,
} from '@akashaproject/design-system/lib/components/EnsFormCard';
import {
  useUsernameProviderUpdate,
  useEnsRegistration,
} from '@akashaproject/ui-awf-hooks/lib/use-username.new';

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

const getUsernameTypes = () => {
  return { available: [UsernameTypes.TEXTILE] };
};

const getEnsFormOptions = usernameTypes => {
  const options: EnsFormOption[] = [];

  // const hasEnsSubdomainAvail = userNameTypes.available.includes(
  //   UsernameTypes.AKASHA_ENS_SUBDOMAIN,
  // );
  // const hasEnsDomainAvail = userNameTypes.available.includes(UsernameTypes.ENS_DOMAIN);
  // // const detectedEns = ensState.userName;
  // const currentDefault = userNameTypes.default;

  /**
   * Show akasha subdomain option if it's not using ens domain
   */
  // if (
  //   hasEnsSubdomainAvail ||
  //   detectedEns?.endsWith('.akasha.eth') ||
  //   currentDefault?.provider === ProfileProviders.ENS ||
  //   currentDefault?.provider === ProfileProviders.EWA_BASIC
  // ) {
  //   options.push({
  //     type: ENSOptionTypes.ENS_AKASHA_SUBDOMAIN,
  //     label: userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)
  //       ? t('Display my AKASHA Ethereum name')
  //       : t('Use an AKASHA-provided Ethereum name'),
  //     value: `${profileState.userName}.akasha.eth`,
  //     defaultChecked: !options.length,
  //     textDetails: userNameType.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN) ? (
  //       <></>
  //     ) : (
  //       <>
  //         {t('Username Powered by')}{' '}
  //         <Icon
  //           type="appEns"
  //           size="xs"
  //           wrapperStyle={{ display: 'inline', verticalAlign: 'middle' }}
  //         />{' '}
  //         <strong>ENS</strong>.{' '}
  //         {t('You will need to pay gas fees to register this Ethereum name.')}
  //       </>
  //     ),
  //   });
  // }
  /**
   * Show ens domain options if we detect one and it's not already set
   */
  // if (
  //   hasEnsDomainAvail ||
  //   (!userNameType.default?.value.endsWith('.eth') &&
  //     detectedEns &&
  //     !detectedEns.endsWith('.akasha.eth'))
  // ) {
  //   options.push({
  //     type: ENSOptionTypes.BRING_YOUR_OWN_ENS,
  //     label: t('Use my own Ethereum name'),
  //     value: ensState.userName as string,
  //     defaultChecked: !options.length,
  //   });
  // }
  /**
   * Show ethAddress option if the user aready have akasha subdomain or ens domain
   */
  // if (hasEnsSubdomainAvail || hasEnsDomainAvail) {
  //   options.push({
  //     type: ENSOptionTypes.ETH_ADDRESS,
  //     label: t('Display only my Ethereum address'),
  //     value: profileState.ethAddress as string,
  //     defaultChecked: !options.length,
  //   });
  // }
  return options;
};

const UpdateENSModal: React.FC<RootComponentProps> = props => {
  const [loginState] = useLoginState({});
  const checkNetworkReq = useNetworkState(loginState.ready?.ethAddress);
  const profileDataQuery = useGetProfile(loginState.ready?.pubKey);
  const updateUsernameProviderQuery = useUsernameProviderUpdate();
  const registerEnsQuery = useEnsRegistration();
  const { t } = useTranslation();

  const userNameTypes = React.useMemo(() => {
    if (loginState.ready?.ethAddress) {
      return getUsernameTypes();
    }
    return { available: [] };
  }, [loginState.ready]);

  const ensFormOptions: EnsFormOption[] = React.useMemo(() => {
    if (profileDataQuery.status === 'success' && loginState.ready?.ethAddress) {
      return getEnsFormOptions(userNameTypes);
    }
  }, [profileDataQuery, userNameTypes, loginState.ready]);

  const handleEnsSubmit = (option: EnsFormOption) => {
    let selectedOption: EnsFormOption | undefined = option;

    if (!selectedOption) {
      selectedOption = ensFormOptions.find(option => option.defaultChecked);
    }

    if (!selectedOption) {
      props.logger.error('Selected option is undefined!');
      return;
    }

    if (
      selectedOption.type === ENSOptionTypes.ENS_AKASHA_SUBDOMAIN &&
      selectedOption.value &&
      !userNameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)
    ) {
      return registerEnsQuery.mutate({ userName: selectedOption.value });
    }
    if (
      selectedOption.type === ENSOptionTypes.ENS_AKASHA_SUBDOMAIN &&
      selectedOption.value &&
      userNameTypes.available.includes(UsernameTypes.AKASHA_ENS_SUBDOMAIN)
    ) {
      return updateUsernameProviderQuery.mutate({
        userName: selectedOption.value,
        provider: ProfileProviders.ENS,
      });
    }
    if (selectedOption.type === ENSOptionTypes.BRING_YOUR_OWN_ENS && selectedOption.value) {
      return updateUsernameProviderQuery.mutate({
        userName: selectedOption.value,
        provider: ProfileProviders.ENS,
      });
    }

    if (selectedOption.type === ENSOptionTypes.ETH_ADDRESS) {
      return updateUsernameProviderQuery.mutate({
        userName: '',
        provider: ProfileProviders.EWA_BASIC,
      });
    }
  };

  const handleModalClose = () => {
    props.singleSpa.navigateToUrl(location.pathname);
  };

  return (
    <ModalContainer>
      {!loginState.ready?.pubKey && (
        <BasicCardBox>
          <Box pad="medium" align="center">
            <Text size="medium" color="grey">
              {`${t('Logging you in')}... ${t('Please wait')}.`}
            </Text>
          </Box>
          <Spinner size={24} />
        </BasicCardBox>
      )}
      {profileDataQuery.status === 'loading' && (
        <BasicCardBox>
          <Box pad="medium" align="center">
            <Text size="medium" color="grey">
              {`${t('Loading profile data')}... ${t('Please wait')}.`}
            </Text>
          </Box>
          <Spinner size={24} />;
        </BasicCardBox>
      )}
      {checkNetworkReq.status === 'loading' && (
        <BasicCardBox>
          <Box pad="medium" align="center">
            <Text size="medium" color="grey">
              {`${t('Checking network requirements')}... ${t('Please wait')}.`}
            </Text>
          </Box>
          <Spinner size={24} />;
        </BasicCardBox>
      )}
      {checkNetworkReq.status === 'error' && (
        <BasicCardBox>
          <Box pad="medium" align="center">
            <Text size="medium" color="grey">
              {`${t('There was an error checking network requirements')}.`}
            </Text>
          </Box>
        </BasicCardBox>
      )}
      {checkNetworkReq.status === 'success' && (
        <>
          {checkNetworkReq.data.networkNotSupported && (
            <BasicCardBox>
              <Box pad="medium" align="center">
                <Text size="medium" color="grey">
                  {`${t('Your network is not supported')}. ${t(
                    'Please switch to the Rinkeby netword and refresh the page',
                  )}.`}
                </Text>
              </Box>
            </BasicCardBox>
          )}
          {!checkNetworkReq.data.networkNotSupported && profileDataQuery.status === 'success' && (
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
              saving={false}
              errorMessage={``}
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
      props.logger.error(error, errorInfo);
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
