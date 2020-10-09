import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { getProfileStore, ProfileState, ProfileStateModel } from '../../state/profile-state';
import { ActionMapper, StateMapper } from 'easy-peasy';
import { ENS_EDIT_PAGE } from '../../routes';

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
  const loggedEthAddress = Profile.useStoreState(
    (state: StateMapper<ProfileState, ''>) => state.loggedEthAddress,
  );
  const checkENSAddress = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.checkENSAddress,
  );
  const registerENSAddress = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.registerENSAddress,
  );
  const ensInfo = Profile.useStoreState((state: StateMapper<ProfileState, ''>) => state.ensInfo);
  const { t } = useTranslation();
  /**
   * Check if the ethAddress has already an ens
   */
  React.useEffect(() => {
    if (loggedEthAddress) {
      checkENSAddress({ ethAddress: loggedEthAddress });
    }
  }, [loggedEthAddress]);

  const onSubmit = (payload: { name: string }) => {
    const { name } = payload;
    const ethAddress = loggedEthAddress;
    if (ethAddress) {
      registerENSAddress({
        name,
        ethAddress,
      });
    }
  };

  return (
    <Box align="center">
      <DS.Helmet>
        <title>ENS | {ENS_EDIT_PAGE}</title>
      </DS.Helmet>
      {!loggedEthAddress && (
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
      {loggedEthAddress && (
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
        />
      )}
    </Box>
  );
};

export default EnsEditPage;
