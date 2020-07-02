import * as React from 'react';
import DS from '@akashaproject/design-system';
import { useProfileState } from '../../state/profile-state';
import { useTranslation } from 'react-i18next';

const { EnsFormCard } = DS;
export interface EnsEditPageProps {
  sdkModules: any;
  globalChannel: any;
  logger: any;
}

const EnsEditPage: React.FC<EnsEditPageProps> = props => {
  const [ensIsValid, setEnsIsValid] = React.useState<boolean | undefined>();
  const [profileState, profileStateActions] = useProfileState(props.sdkModules, props.logger);
  const { t } = useTranslation();
  const [, setValidatingEns] = React.useState(false);

  /**
   * Check if the ethAddress has already an ens
   */
  React.useEffect(() => {
    if (profileState.data.loggedEthAddress) {
      profileStateActions.checkENSAddress({ ethAddress: profileState.data.loggedEthAddress });
    }
  }, [profileState.data.loggedEthAddress]);

  const onSubmit = (payload: { name: string; providerName: string }) => {
    const { name, providerName } = payload;
    const ethAddress = profileState.data.loggedEthAddress;
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
    Promise.resolve(name).then(() => {
      setValidatingEns(false);
      setEnsIsValid(true);
    });
  };

  return (
    <div>
      {!profileState.data.loggedEthAddress && <>You must sign in!</>}
      {profileState.data.loggedEthAddress && (
        <EnsFormCard
          titleLabel={t('Ethereum Address')}
          secondaryTitleLabel={t('ENS name')}
          nameLabel={t('Add an ethereum name to your address')}
          errorLabel={'Sorry, this name is unavailable. Please choose another one.'}
          cancelLabel={t('Cancel')}
          saveLabel={t('Save')}
          nameFieldPlaceholder={'yourname'}
          ethAddress={profileState.data.loggedEthAddress}
          providerData={{
            providerName: 'ENS',
          }}
          handleSubmit={onSubmit}
          validateEns={validateEns}
          validEns={ensIsValid}
        />
      )}
    </div>
  );
};

export default EnsEditPage;
