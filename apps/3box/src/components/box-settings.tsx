import * as React from 'react';
import * as H from 'history';
import { match } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import ErrorInfoCard from './error-info-card';
import { useBoxProfile } from '../state';
import { useTranslation } from 'react-i18next';

const { Box, TextInputField, BasicCardBox, styled, Button } = DS;
const FormArea = styled(Box)`
  width: 50%;
`;
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
  channelUtils: any;
  sdkModules: any;
}

const BoxSettings: React.FC<IBoxSettingsProps> = props => {
  const [state, actions] = useBoxProfile(props.sdkModules, props.channelUtils);
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

  const handleReset = () => {
    // reset to default values
    if (state.data.ethAddress) {
      actions.resetBoxSettings(state.data.ethAddress);
    }
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
    <Box fill={true} flex={true} pad={{ top: '1em' }} align="center">
      <FormArea>
        <ErrorInfoCard errors={state.data.errors}>
          <SettingsFormCard>
            <SettingsCardTitle>{t('3Box Settings')}</SettingsCardTitle>
            <TextInputField
              label={t('Pinning Node')}
              id="3box-settings-pinning-node"
              ref={pinningNodeInput}
              defaultValue={state.data.settings.pinningNode}
            />
            <TextInputField
              label={t('Address Server')}
              id="3box-settings-address-server"
              ref={addressServerInput}
              defaultValue={state.data.settings.addressServer}
            />
            <Box direction="row" alignSelf="end">
              <Button label="Reset" onClick={handleReset} margin={{ right: '.5em' }} />
              <Button label="Save" primary={true} onClick={handleSubmit} />
            </Box>
          </SettingsFormCard>
        </ErrorInfoCard>
      </FormArea>
    </Box>
  );
};

export default BoxSettings;
