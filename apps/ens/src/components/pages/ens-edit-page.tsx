import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { getProfileStore, ProfileState, ProfileStateModel } from '../../state/profile-state';
import { ActionMapper, StateMapper } from 'easy-peasy';
import { ENS_EDIT_PAGE } from '../../routes';

const { EnsFormCard, Box } = DS;
export interface EnsEditPageProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
}

const EnsEditPage: React.FC<EnsEditPageProps> = () => {
  const [ensIsValid, setEnsIsValid] = React.useState<boolean | undefined>(true);
  const Profile = getProfileStore();
  const loggedEthAddress = Profile.useStoreState(
    (state: StateMapper<ProfileState, ''>) => state.loggedEthAddress,
  );
  // const checkENSAddress = Profile.useStoreActions((actions: ActionMapper<ProfileStateModel, "">) => actions.checkENSAddress);
  const registerENSAddress = Profile.useStoreActions(
    (actions: ActionMapper<ProfileStateModel, ''>) => actions.registerENSAddress,
  );
  const ensInfo = Profile.useStoreState((state: StateMapper<ProfileState, ''>) => state.ensInfo);
  const { t } = useTranslation();
  const [validatingEns, setValidatingEns] = React.useState(false);

  /**
   * Check if the ethAddress has already an ens
   */
  // React.useEffect(() => {
  //   if (loggedEthAddress) {
  //     checkENSAddress({ ethAddress: loggedEthAddress });
  //   }
  // }, [loggedEthAddress]);

  const onSubmit = (payload: { name: string; providerName: string }) => {
    const { name, providerName } = payload;
    const ethAddress = loggedEthAddress;
    if (ethAddress) {
      registerENSAddress({
        name,
        providerName,
        ethAddress,
      });
    }
  };

  const validateEns = (name: string) => {
    setValidatingEns(true);
    // validate ens on the remote?
    const delay = new Promise(resolve => {
      setTimeout(() => resolve(name), 1000);
    });
    delay.then(() => {
      setValidatingEns(false);
      setEnsIsValid(true);
    });
  };

  return (
    <Box align="center" pad={{ top: '1em' }} width="100vw">
      <DS.Helmet>
        <title>ENS | {ENS_EDIT_PAGE}</title>
      </DS.Helmet>
      {!loggedEthAddress && <>You must sign in!</>}
      {loggedEthAddress && (
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
          validateEns={validateEns}
          validEns={ensIsValid}
          isValidating={validatingEns}
        />
      )}
    </Box>
  );
};

export default EnsEditPage;
