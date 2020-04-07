import * as React from 'react';
import * as H from 'history';
import { match } from 'react-router-dom';
import DS from '@akashaproject/design-system';
import ErrorInfoCard from './error-info-card';
import { useBoxProfile } from '../state';
import { useTranslation } from 'react-i18next';
import TextIcon from '@akashaproject/design-system/lib/components/TextIcon/title-text/text-icon';

const { Box, TextInputField, BasicCardBox, styled, Button } = DS;
const FormArea = styled(Box)`
  width: 50%;
`;
const SettingsFormCard = styled(BasicCardBox)`
  padding: 1em;
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
  const pinningNodeInput = React.createRef();
  const addressServerInput = React.createRef();
  React.useEffect(() => {
    if (!state.data.ethAddress) {
      actions.getLoggedEthAddress();
    }
  }, [state.data.ethAddress]);
  React.useEffect(() => {
    if (state.data.ethAddress) {
      actions.getSettings(state.data.ethAddress);
    }
  }, [state.data.ethAddress]);

  const handleReset = () => {
    console.log('reset to default values');
  };

  const handleSubmit = () => {
    console.log('save settings');
  };

  return (
    <Box fill={true} flex={true} pad={{ top: '1em' }} align="center">
      <FormArea>
        <ErrorInfoCard errors={state.data.errors}>
          <SettingsFormCard>
            <TextIcon iconType="settings" label="3Box Settings" size="md" clickable={false} />
            <TextInputField
              label={t('Pinning Node')}
              id="3box-settings-pinning-node"
              ref={pinningNodeInput}
            />
            <TextInputField
              label={t('Address Server')}
              id="3box-settings-address-server"
              ref={addressServerInput}
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
