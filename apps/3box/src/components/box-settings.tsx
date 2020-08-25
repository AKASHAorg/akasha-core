import * as React from 'react';
import DS from '@akashaproject/design-system';
import { getProfileStore, ProfileStateModel } from '../state';
import { useTranslation } from 'react-i18next';
import { ActionMapper, StateMapper } from 'easy-peasy';

const { Box, TextInputField, styled, Button, MainAreaCardBox, ErrorInfoCard, ErrorLoader } = DS;

const SettingsCardTitle = styled.h3`
  font-size: 1.5em;
  user-select: none;
  margin: 0.75rem;
`;

export interface IBoxSettingsProps {
  globalChannel?: any;
  sdkModules: any;
  logger: any;
}

const BoxSettings: React.FC<IBoxSettingsProps> = () => {
  const ProfileStore = getProfileStore();
  const stateData = ProfileStore.useStoreState((s: StateMapper<ProfileStateModel, ''>) => s.data);
  const saveBoxSettings = ProfileStore.useStoreActions(
    (a: ActionMapper<ProfileStateModel, ''>) => a.saveBoxSettings,
  );
  const resetBoxSettings = ProfileStore.useStoreActions(
    (a: ActionMapper<ProfileStateModel, ''>) => a.resetBoxSettings,
  );
  const getBoxSettings = ProfileStore.useStoreActions(
    (a: ActionMapper<ProfileStateModel, ''>) => a.getBoxSettings,
  );
  const getLoggedEthAddress = ProfileStore.useStoreActions(
    (a: ActionMapper<ProfileStateModel, ''>) => a.getLoggedEthAddress,
  );

  const { isSaving } = stateData;
  const [formValues, setFormValues] = React.useState(stateData.settings);
  const { t } = useTranslation();
  const pinningNodeInput = React.createRef<HTMLInputElement>();
  const addressServerInput = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    if (!stateData.ethAddress) {
      getLoggedEthAddress();
    }
  }, [stateData.ethAddress]);

  React.useEffect(() => {
    if (stateData.ethAddress) {
      getBoxSettings(stateData.ethAddress);
    }
  }, [stateData.ethAddress]);

  // when settings are changed in global state, update it
  React.useEffect(() => {
    if (stateData.settings.pinningNode !== formValues.pinningNode) {
      handleChange({ pinningNode: stateData.settings.pinningNode });
    }
    if (stateData.settings.addressServer !== formValues.pinningNode) {
      handleChange({ addressServer: stateData.settings.addressServer });
    }
  }, [JSON.stringify(stateData.settings)]);

  const handleReset = () => {
    // reset to default values
    if (stateData.ethAddress) {
      resetBoxSettings(stateData.ethAddress);
    }
  };
  const handleChange = (newValues: { [key: string]: string }) => {
    setFormValues(prevValues => ({
      ...prevValues,
      ...newValues,
    }));
  };
  const handleSubmit = () => {
    // save new settings
    if (stateData.ethAddress && pinningNodeInput.current && addressServerInput.current) {
      saveBoxSettings({
        ethAddress: stateData.ethAddress,
        pinningNode: pinningNodeInput.current.value,
        addressServer: addressServerInput.current.value,
      });
    }
  };

  return (
    <Box fill="horizontal" flex={true} align="center">
      <DS.Helmet>
        <title>3Box | {t('Settings')}</title>
      </DS.Helmet>
      <MainAreaCardBox>
        <ErrorInfoCard errors={stateData.errors}>
          {(errors, hasCriticalErrors) => (
            <>
              {errors && (
                <ErrorLoader
                  type="script-error"
                  title={t('There was an error loading your 3Box settings')}
                  details={t('We cannot show 3Box settings right now')}
                  devDetails={errors}
                />
              )}
              {!hasCriticalErrors && (
                <Box pad="1em">
                  <SettingsCardTitle>{t('3Box Settings')}</SettingsCardTitle>
                  <TextInputField
                    label={t('Pinning Node')}
                    name="pinningNode"
                    id="3box-settings-pinning-node"
                    ref={pinningNodeInput}
                    value={formValues.pinningNode}
                    onChange={ev => handleChange({ pinningNode: ev.target.value })}
                  />
                  <TextInputField
                    label={t('Address Server')}
                    name="addressServer"
                    id="3box-settings-address-server"
                    ref={addressServerInput}
                    value={formValues.addressServer}
                    onChange={ev => handleChange({ addressServer: ev.target.value })}
                  />
                  <Box direction="row" justify="between">
                    <Box direction="row" alignSelf="start">
                      <Box
                        style={{
                          opacity: isSaving ? '1' : '0',
                          transition: 'opacity 2s cubic-bezier(0, 1, 0.5, 0)',
                        }}
                      >
                        {t('Saving Settings')}
                      </Box>
                    </Box>
                    <Box direction="row" alignSelf="end">
                      <Button label={t('Reset')} onClick={handleReset} margin={{ right: '.5em' }} />
                      <Button label={t('Save')} primary={true} onClick={handleSubmit} />
                    </Box>
                  </Box>
                </Box>
              )}
            </>
          )}
        </ErrorInfoCard>
      </MainAreaCardBox>
    </Box>
  );
};

export default BoxSettings;
