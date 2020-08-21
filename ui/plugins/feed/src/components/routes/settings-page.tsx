import * as React from 'react';
import { RouteProps } from 'react-router';
import DS from '@akashaproject/design-system';
import { useProfileState } from '../../state/profile-state';
import { useSettingsState } from '../../state/settings-state';
import { useTranslation } from 'react-i18next';

const { Box, TextInputField, Button, BasicCardBox, ErrorInfoCard, ErrorLoader } = DS;

export interface ISettingsPageProps {
  sdkModules: any;
  logger: any;
}

const SettingsPage: React.FC<ISettingsPageProps & RouteProps> = props => {
  const { sdkModules, logger } = props;
  const [profileState] = useProfileState(sdkModules, logger);
  const [settingsState, settingsActions] = useSettingsState(sdkModules, logger);
  const [formValues, setFormValues] = React.useState({
    ipfsGateway: settingsState.data.settings.ipfsGateway,
  });

  const { t } = useTranslation();
  const { loggedEthAddress } = profileState.data;

  React.useEffect(() => {
    if (loggedEthAddress) {
      settingsActions.getSettings({ ethAddress: loggedEthAddress });
    }
  }, [loggedEthAddress]);

  React.useEffect(() => {
    if (settingsState.data.settings.ipfsGateway !== formValues.ipfsGateway) {
      setFormValues(prev => ({
        ...prev,
        ipfsGateway: settingsState.data.settings.ipfsGateway,
      }));
    }
  }, [settingsState.data.settings]);

  const changeIpfsGateway = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({
      ...prev,
      ipfsGateway: ev.target.value,
    }));
    ev.persist();
  };
  const handleSettingsSave = () => {
    if (loggedEthAddress) {
      settingsActions.saveSettings({ ethAddress: loggedEthAddress, settings: formValues });
    }
  };
  const handleSettingsReset = () => {
    if (loggedEthAddress) {
      settingsActions.resetToDefaults({ ethAddress: loggedEthAddress });
    }
  };
  return (
    <Box fill="horizontal" flex={true}>
      <ErrorInfoCard errors={settingsState.data.errors}>
        {(messages, isCritical) => (
          <>
            {messages && (
              <ErrorLoader
                type="script-error"
                title={t('Error loading the settings')}
                details={messages}
              />
            )}
            {!isCritical && (
              <BasicCardBox style={{ padding: '1em' }}>
                {settingsState.data.fetching && <Box>Loading settings, please wait</Box>}
                {!settingsState.data.fetching && (
                  <>
                    <TextInputField
                      label={t('IPFS Gateway')}
                      id="feedApp-ipfs-gateway"
                      name="feddApp-ipfs-gateway"
                      value={formValues.ipfsGateway}
                      onChange={changeIpfsGateway}
                    />
                    <Box flex={true} direction="row" justify="end">
                      <Button
                        secondary={true}
                        label={t('Reset to defaults')}
                        margin={{ right: '.5em' }}
                        onClick={handleSettingsReset}
                      />
                      <Button primary={true} label={t('Save')} onClick={handleSettingsSave} />
                    </Box>
                  </>
                )}
              </BasicCardBox>
            )}
          </>
        )}
      </ErrorInfoCard>
    </Box>
  );
};

export default SettingsPage;
