import React from 'react';

import DS from '@akashaorg/design-system';
import { EthProviders } from '@akashaorg/typings/sdk';

import BoxedIcon from './boxed-icon';
import IndicatorDots from './indicator-dots';

export interface IConnectWalletProps {
  isActive: boolean;
  titleLine1Label: string;
  titleLine2Label: string;
  selectedProvider: EthProviders;
  status: number;
  statusLabel: string;
  statusDescription: string;
  yourAddressLabel: string;
  connectedAddress: string;
  connectedAddressPlaceholder: string;
  footerLabel: string;
  onSignIn: () => void;
  onSignInComplete: () => void;
  onDisconnect: () => void;
}

const { Box, Icon, Text } = DS;

const ConnectWallet: React.FC<IConnectWalletProps> = props => {
  const {
    isActive,
    titleLine1Label,
    titleLine2Label,
    selectedProvider,
    status,
    statusLabel,
    statusDescription,
    yourAddressLabel,
    connectedAddress,
    connectedAddressPlaceholder,
    footerLabel,
    onSignIn,
    onSignInComplete,
    onDisconnect,
  } = props;

  const signInCall = React.useRef(onSignIn);
  const signInCompleteCall = React.useRef(onSignInComplete);

  React.useEffect(() => {
    if (isActive) {
      return signInCall.current();
    }
  }, [isActive]);

  React.useEffect(() => {
    if (status >= 8) {
      signInCompleteCall.current();
    }
  }, [status]);

  console.log({ status });

  return (
    <Box
      // border={{ color: 'red' }}
      gap="medium"
    >
      <Box align="center">
        <Text size="xlarge" weight="bold">
          {titleLine1Label}
        </Text>
        <Text size="xlarge" weight="bold">
          {titleLine2Label}
        </Text>
      </Box>

      <Box direction="row" justify="center" align="center" gap="small">
        <BoxedIcon
          iconType={selectedProvider === EthProviders.Web3Injected ? 'metamask' : 'walletconnect'}
          backgroundColor={selectedProvider === EthProviders.Web3Injected ? '#fef5e6' : '#5397F7'}
          iconSize="xxl"
        />

        <IndicatorDots status={status} />

        <BoxedIcon
          iconType="akasha"
          backgroundColor="linear-gradient(180deg, #D2DBFF 0%, #FBD5D4 100%)"
          iconSize="xxl"
        />
      </Box>

      <Box gap="small">
        <Box align="center">
          <Text size="xlarge" weight="bold">
            {statusLabel}
          </Text>
          <Text color="secondaryText">{statusDescription}</Text>
        </Box>

        <Box align="center">
          <Text size="small" color="secondaryText">
            {yourAddressLabel}
          </Text>
          {!!connectedAddress.length && <Text color="secondaryText">{connectedAddress}</Text>}

          {!connectedAddress.length && (
            <Text color="secondaryText">{connectedAddressPlaceholder}</Text>
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
            {footerLabel}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectWallet;
