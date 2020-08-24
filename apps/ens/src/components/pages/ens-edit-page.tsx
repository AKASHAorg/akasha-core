import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useProfileState } from '../../state/profile-state';
import { useTranslation } from 'react-i18next';

const { EnsFormCard, Box } = DS;
export interface EnsEditPageProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
}

const EnsEditPage: React.FC<EnsEditPageProps> = props => {
  const [ensIsValid, setEnsIsValid] = React.useState<boolean | undefined>();
  const [profileState, profileStateActions] = useProfileState(props.sdkModules, props.logger);
  const { t } = useTranslation();
  const [validatingEns, setValidatingEns] = React.useState(false);

  /**
   * Check if the ethAddress has already an ens
   */
  React.useEffect(() => {
    if (profileState.loggedEthAddress) {
      profileStateActions.checkENSAddress({ ethAddress: profileState.loggedEthAddress });
    }
  }, [profileState.loggedEthAddress]);

  const onSubmit = (payload: { name: string; providerName: string }) => {
    const { name, providerName } = payload;
    const ethAddress = profileState.loggedEthAddress;
    if (ethAddress) {
      profileStateActions.registerENSAddress({
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
    <Box align="center">
      {!profileState.loggedEthAddress && <>You must sign in!</>}
      {profileState.loggedEthAddress && (
        <EnsFormCard
          titleLabel={t('Ethereum Address')}
          secondaryTitleLabel={t('ENS name')}
          nameLabel={t('Add an ethereum name to your address')}
          errorLabel={'Sorry, this name is unavailable. Please choose another one.'}
          cancelLabel={t('Cancel')}
          saveLabel={t('Save')}
          nameFieldPlaceholder={t('yourname')}
          ethAddress={profileState.loggedEthAddress}
          providerData={profileState.ensInfo}
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
