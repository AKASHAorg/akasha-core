import React from 'react';

import DS from '@akashaorg/design-system';
import { EthProviders } from '@akashaorg/typings/sdk';

import BoxedIcon from './boxed-icon';
import IndicatorDots from './indicator-dots';
import { useTranslation } from 'react-i18next';

export interface IConnectWalletProps {
  selectedProvider: EthProviders;
  status: number;
  connectedAddress: string;
  onSignIn: () => void;
  onSignInComplete: () => void;
  onDisconnect: () => void;
  onConnectWallet: () => void;
}

const { Box, Icon, Text } = DS;

const ConnectWallet: React.FC<IConnectWalletProps> = props => {
  const {
    selectedProvider,
    status,
    connectedAddress,
    onSignIn,
    onSignInComplete,
    onDisconnect,
    onConnectWallet,
  } = props;

  const signInCall = React.useRef(onSignIn);
  const signInCompleteCall = React.useRef(onSignInComplete);

  const { t } = useTranslation('app-auth-ewa');

  React.useEffect(() => {
    onConnectWallet();
  }, []);

  React.useEffect(() => {
    if (signInCall.current) {
      signInCall.current();
    }
  }, []);

  React.useEffect(() => {
    if (status >= 8) {
      signInCompleteCall.current();
    }
  }, [status]);

  return (
    <Box gap="medium">
      <Box align="center">
        <Text size="xlarge" weight="bold">
          {t('Connect to AKASHA World')}
        </Text>
        <Text size="xlarge" weight="bold">
          {t('using your wallet')}
        </Text>
      </Box>

      <Box direction="row" justify="center" align="center" gap="small">
        <BoxedIcon
          iconType={selectedProvider === EthProviders.Web3Injected ? 'metamask' : 'walletconnect'}
          backgroundColor={
            selectedProvider === EthProviders.Web3Injected ? 'lightGold' : 'deepBlue'
          }
          iconSize="xxl"
        />

        <IndicatorDots status={status} errorMessage={''} />

        <BoxedIcon
          iconType="akasha"
          backgroundColor="linear-gradient(180deg, #D2DBFF 0%, #FBD5D4 100%)"
          iconSize="xxl"
        />
      </Box>

      <Box gap="small">
        {/*<Box align="center">*/}
        {/*  <Text size="xlarge" weight="bold">*/}
        {/*    {statusLabel}*/}
        {/*  </Text>*/}
        {/*  <Text color="secondaryText" textAlign="center">*/}
        {/*    {statusDescription}.*/}
        {/*  </Text>*/}
        {/*</Box>*/}

        <Box align="center">
          <Text size="small" color="secondaryText">
            {t('Your Address')}
          </Text>
          {!!connectedAddress?.length && <Text color="secondaryText">{connectedAddress}</Text>}

          {!connectedAddress?.length && (
            <Text color="secondaryText">
              {t('The address you select to connect with will be shown here')}
            </Text>
          )}
        </Box>

        <Box direction="row" justify="center" gap="small">
          <Icon type="disconnect" plain={true} />
          <Text
            size="large"
            color="accentText"
            onClick={onDisconnect}
            style={{ cursor: 'pointer' }}
          >
            {t('Disconnect or change way to connect')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectWallet;
