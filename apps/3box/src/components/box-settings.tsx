import * as React from 'react';
import * as H from 'history';
import { match } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import ErrorInfoCard from './error-info-card';
import { useBoxProfile } from '../state';
import { useTranslation } from 'react-i18next';

const { Box, TextInputField, BasicCardBox, styled, Button, MainAreaCardBox } = DS;

const SettingsFormCard = styled(BasicCardBox)`
  padding: 1em;
`;

const SettingsCardTitle = styled.h3`
  font-size: 1.5em;
  user-select: none;
  margin: 0.75rem;
`;

export interface IBoxSettingsProps {
  history: H.History;
  location: H.Location;
  match: match;
  globalChannel?: any;
  sdkModules: any;
  logger: any;
}

const BoxSettings: React.FC<IBoxSettingsProps> = props => {
  const [state, actions] = useBoxProfile(props.sdkModules, props.globalChannel, props.logger);
  const { isSaving } = state.data;
  const [formValues, setFormValues] = React.useState(state.data.settings);
  const { t } = useTranslation();
  const pinningNodeInput = React.createRef<HTMLInputElement>();
  const addressServerInput = React.createRef<HTMLInputElement>();

  React.useEffect(() => {
    if (!state.data.ethAddress) {
      actions.getLoggedEthAddress();
    }
  }, [state.data.ethAddress]);

  React.useEffect(() => {
    if (state.data.ethAddress) {
      actions.getBoxSettings(state.data.ethAddress);
    }
  }, [state.data.ethAddress]);

  // when settings are changed in global state, update it
  React.useEffect(() => {
    if (state.data.settings.pinningNode !== formValues.pinningNode) {
      handleChange({ pinningNode: state.data.settings.pinningNode });
    }
    if (state.data.settings.addressServer !== formValues.pinningNode) {
      handleChange({ addressServer: state.data.settings.addressServer });
    }
  }, [JSON.stringify(state.data.settings)]);

  const handleReset = () => {
    // reset to default values
    if (state.data.ethAddress) {
      actions.resetBoxSettings(state.data.ethAddress);
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
    if (state.data.ethAddress && pinningNodeInput.current && addressServerInput.current) {
      actions.saveBoxSettings({
        ethAddress: state.data.ethAddress,
        pinningNode: pinningNodeInput.current.value,
        addressServer: addressServerInput.current.value,
      });
    }
  };

  return (
    <Box fill="horizontal" flex={true} pad={{ top: '1em' }} align="center">
      <DS.Helmet>
        <title>3Box | {t('Settings')}</title>
      </DS.Helmet>
      <MainAreaCardBox>
        <ErrorInfoCard errors={state.data.errors}>
          <SettingsFormCard>
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
          </SettingsFormCard>
        </ErrorInfoCard>
      </MainAreaCardBox>
    </Box>
  );
};

export default BoxSettings;
