import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { getProfileStore, ProfileState, ProfileStateModel } from '../../state/profile-state';
import { ActionMapper, StateMapper } from 'easy-peasy';
import { ENS_EDIT_PAGE } from '../../routes';
import debounce from 'lodash.debounce';

const { EnsFormCard, Box, ErrorLoader, Button } = DS;
export interface EnsEditPageProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
  onLoginModalShow: () => void;
}

const EnsEditPage: React.FC<EnsEditPageProps> = props => {
  const { onLoginModalShow, sdkModules, globalChannel, logger } = props;
  const Profile = getProfileStore(sdkModules, globalChannel, logger);
  const isLoading = Profile.useStoreState((s: StateMapper<ProfileStateModel, ''>) => s.fetching);
  const loggedEthAddress = Profile.useStoreState(
    (state: StateMapper<ProfileState, ''>) => state.loggedEthAddress,
  );
  const registrationStatus = Profile.useStoreState(
    (s: StateMapper<ProfileState, ''>) => s.registrationStatus,
  );
  const registrationStatusReceived = Profile.useStoreState(
    (s: StateMapper<ProfileState, ''>) => s.statusReceived,
  );

  const ensChecked = Profile.useStoreState((s: StateMapper<ProfileStateModel, ''>) => s.ensChecked);

  const getENSByAddress = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.getENSByAddress,
  );
  const getENSRegistrationStatus = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.getEnsRegistrationStatus,
  );
  const checkENSAvailable = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.checkENSAvailable,
  );
  const registerENS = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.registerENS,
  );
  const claimENS = Profile.useStoreActions((s: ActionMapper<ProfileStateModel, ''>) => s.claimENS);
  const ensInfo = Profile.useStoreState((state: StateMapper<ProfileState, ''>) => state.ensInfo);
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
    const { name, providerName } = payload;
    const ethAddress = loggedEthAddress;
    if (ethAddress) {
      registerENS({
        name,
        providerName,
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
        !registrationStatus && (
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
          titleLabel={t('Ethereum Address')}
          secondaryTitleLabel={t('ENS name')}
          nameLabel={t('Add an ethereum name to your address')}
          errorLabel={t('Sorry, this name is unavailable. Please choose another one.')}
          cancelLabel={t('Cancel')}
          saveLabel={t('Save')}
          nameFieldPlaceholder={t('yourname')}
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

export default EnsEditPage;
