import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { ProfileStateModel } from '../../state/profile-state';
import { ActionMapper, StateMapper, createContextStore } from 'easy-peasy';
import { ENS_EDIT_PAGE } from '../../routes';
import debounce from 'lodash.debounce';

const { EnsFormCard, Box, ErrorLoader, Button } = DS;
export interface EnsEditPageProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
  onLoginModalShow: () => void;
  profileStore: ReturnType<typeof createContextStore>;
}

/* eslint-disable complexity */

const EnsEditPage: React.FC<EnsEditPageProps> = props => {
  const { onLoginModalShow, profileStore } = props;

  const [
    isLoading,
    loggedEthAddress,
    registrationStatus,
    registrationStatusReceived,
    ensChecked,
    ensInfo,
  ] = profileStore.useStoreState((s: StateMapper<ProfileStateModel, ''>) => [
    s.fetching,
    s.loggedEthAddress,
    s.registrationStatus,
    s.statusReceived,
    s.ensChecked,
    s.ensInfo,
  ]);

  const [
    getENSByAddress,
    getENSRegistrationStatus,
    checkENSAvailable,
    registerENS,
    claimENS,
  ] = profileStore.useStoreActions((act: ActionMapper<ProfileStateModel, ''>) => [
    act.getENSByAddress,
    act.getEnsRegistrationStatus,
    act.checkENSAvailable,
    act.registerENS,
    act.claimENS,
  ]);

  const { t } = useTranslation();
  /**
   * Check if the ethAddress has already an ens
   */
  React.useEffect(() => {
    if (loggedEthAddress) {
      getENSByAddress({ ethAddress: loggedEthAddress });
      getENSRegistrationStatus({ ethAddress: loggedEthAddress });
    }
  }, [loggedEthAddress]);

  React.useEffect(() => {
    if (
      registrationStatusReceived &&
      registrationStatus &&
      registrationStatus.registering &&
      !registrationStatus.claiming &&
      loggedEthAddress
    ) {
      claimENS({ ...registrationStatus, ethAddress: loggedEthAddress });
    }
  }, [registrationStatus, registrationStatusReceived, ensChecked, ensInfo, loggedEthAddress]);

  const onSubmit = (payload: { name: string; providerName: string }) => {
    const { name } = payload;
    const ethAddress = loggedEthAddress;
    if (ethAddress) {
      registerENS({
        name,
        ethAddress,
      });
    }
  };

  const handleEnsValidation = (name: string) => {
    if (!name.length) {
      return;
    }
    if (registrationStatus) {
      checkENSAvailable({
        ...registrationStatus,
        name,
      });
    } else {
      checkENSAvailable({
        name,
        isAvailable: false,
        checking: true,
        registering: false,
        claiming: false,
      });
    }
  };

  const throttledEnsValidation = debounce(handleEnsValidation, 250, { trailing: true });

  return (
    <Box align="center">
      <DS.Helmet>
        <title>ENS | {ENS_EDIT_PAGE}</title>
      </DS.Helmet>
      {!loggedEthAddress && isLoading && <>Detecting eth address...</>}
      {loggedEthAddress && isLoading && <>Looking for ENS Address</>}
      {loggedEthAddress &&
        registrationStatusReceived &&
        registrationStatus &&
        registrationStatus.registering && <>Resuming ENS Registration</>}
      {!loggedEthAddress &&
        !isLoading &&
        registrationStatusReceived &&
        registrationStatus &&
        registrationStatus.registering && (
          <ErrorLoader
            type="no-login"
            title={t('No Ethereum address detected')}
            details={t(
              'You need to login or allow access to your current Ethereum address in your Web3 Ethereum client like MetaMask, and then reload, please.',
            )}
          >
            <Box direction="row">
              {/* <Button label={t('Cancel')} secondary={true} margin={{ right: '.5em' }} /> */}
              <Button label={t('Connect Wallet')} primary={true} onClick={onLoginModalShow} />
            </Box>
          </ErrorLoader>
        )}
      {loggedEthAddress && !isLoading && (
        <EnsFormCard
          titleLabel={t('Add a Username')}
          secondaryTitleLabel={t('Ethereum Name')}
          nameLabel={t('Select a username')}
          errorLabel={t('Sorry, this username has already been taken. Please choose another one.')}
          ethAddressLabel={t('Your Ethereum Address')}
          ethNameLabel={t('Your Ethereum Name')}
          optionUsername={t('username')}
          optionSpecify={t('Specify an Ethereum name')}
          optionUseEthereumAddress={t('Use my Ethereum address')}
          consentText={t('By creating an account you agree to the ')}
          consentUrl={'https://ethereum.world/community-agreement'}
          consentLabel={t('Community Agreement')}
          poweredByLabel={t('Username powered by')}
          iconLabel={t('ENS')}
          cancelLabel={t('Cancel')}
          saveLabel={t('Save')}
          nameFieldPlaceholder={`@${t('username')}`}
          ethAddress={loggedEthAddress}
          providerData={ensInfo}
          handleSubmit={onSubmit}
          validateEns={throttledEnsValidation}
          isValidating={registrationStatus ? registrationStatus.checking : false}
          validEns={registrationStatus ? registrationStatus.isAvailable : undefined}
        />
      )}
    </Box>
  );
};

/* eslint-enable complexity */

export default EnsEditPage;
