import * as React from 'react';
import { RouteProps } from 'react-router';
import DS from '@akashaproject/design-system';
import { useProfileState } from '../../state/profile-state';
import { useSettingsState } from '../../state/settings-state';
import { useTranslation } from 'react-i18next';

const { Box, TextInputField, Button, BasicCardBox } = DS;

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

  const changeIpfsGateway = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues(prev => ({
      ...prev,
      ipfsGateway: ev.target.value,
    }));
    ev.persist();
  };

  return (
    <Box fill={true} flex={true}>
      <BasicCardBox style={{ padding: '1em' }}>
        <TextInputField
          label={t('IPFS Gateway')}
          id="feedApp-ipfs-gateway"
          name="feddApp-ipfs-gateway"
          value={formValues.ipfsGateway}
          onChange={changeIpfsGateway}
        />
        <Box flex={true} direction="row" justify="end">
          <Button secondary={true} label={t('Reset to defaults')} margin={{ right: '.5em' }} />
          <Button primary={true} label={t('Save')} />
        </Box>
      </BasicCardBox>
    </Box>
  );
};

export default SettingsPage;
