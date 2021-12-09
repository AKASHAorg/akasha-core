import * as React from 'react';
import { INJECTED_PROVIDERS } from '@akashaproject/sdk-typings/lib/interfaces/common';
import DS from '@akashaproject/design-system';
import { StyledButton } from './styles';

const { Text, Icon, Box, VariableIconButton } = DS;

export interface IRequiredNetworkStepProps {
  injectedProvider: INJECTED_PROVIDERS;
  isOnRequiredNetwork: boolean;
  setRequiredNetworkLabel?: string;
  setRequiredNetworkBoldLabel?: string;
  setRequiredNetworkAccentLabel?: string;
  metamaskCTAIntroLabel?: string;
  metamaskCTAAccentLabel?: string;
  metamaskCTALabel?: string;
  otherprovidersCTALabel?: string;
  variableIconButtonLabel?: string;
  variableIconErrorLabel?: string;
  isNetworkCheckLoading?: boolean;
  isNetworkCheckError?: boolean;
  isOnRequiredNetworkLabel?: string;
  buttonLabel?: string;
  onClickSwitchMetamaskNetwork: () => void;
  onClickCheckNetwork?: () => void;
  onButtonClick?: () => void;
}

const RequiredNetworkStep: React.FC<IRequiredNetworkStepProps> = props => {
  const {
    injectedProvider,
    isOnRequiredNetwork,
    setRequiredNetworkLabel,
    setRequiredNetworkBoldLabel,
    setRequiredNetworkAccentLabel,
    metamaskCTAIntroLabel,
    metamaskCTAAccentLabel,
    metamaskCTALabel,
    otherprovidersCTALabel,
    variableIconButtonLabel,
    variableIconErrorLabel,
    isNetworkCheckLoading,
    isNetworkCheckError,
    isOnRequiredNetworkLabel,
    buttonLabel,
    onClickSwitchMetamaskNetwork,
    onClickCheckNetwork,
    onButtonClick,
  } = props;
  if (isOnRequiredNetwork) {
    return (
      <>
        <Text size="large" margin={{ bottom: 'large' }}>
          {isOnRequiredNetworkLabel}
        </Text>
        <Box
          align="flex-end"
          justify="center"
          margin={{ top: 'small' }}
          pad={{ top: 'medium' }}
          border={{ side: 'top', color: 'border', size: 'xsmall' }}
        >
          <StyledButton
            primary={true}
            icon={<Icon type="arrowRight" color="white" />}
            reverse={true}
            label={buttonLabel}
            onClick={onButtonClick}
          />
        </Box>
      </>
    );
  }
  return (
    <>
      <Text size="large" margin={{ bottom: 'large' }}>
        {setRequiredNetworkLabel}
        <Text size="large" weight="bold">
          {setRequiredNetworkBoldLabel}
        </Text>{' '}
        <Text size="large" weight="bold" color="accentText">
          {setRequiredNetworkAccentLabel}
        </Text>
        .{' '}
        {injectedProvider === INJECTED_PROVIDERS.METAMASK && (
          <>
            <Text size="large">
              {metamaskCTAIntroLabel}{' '}
              <Text
                size="large"
                color="accentText"
                style={{ cursor: 'pointer' }}
                onClick={onClickSwitchMetamaskNetwork}
              >
                {metamaskCTAAccentLabel}
              </Text>{' '}
              {metamaskCTALabel}
            </Text>
          </>
        )}
        {injectedProvider !== INJECTED_PROVIDERS.METAMASK && (
          <>
            <Text size="large">{otherprovidersCTALabel}</Text>
          </>
        )}
      </Text>
      {/* video area (if injectedProvider is MetaMask): setting to the required network on MetaMask */}
      <VariableIconButton
        titleLabel={variableIconButtonLabel}
        errorLabel={variableIconErrorLabel}
        isLoading={isNetworkCheckLoading}
        isError={isNetworkCheckError}
        onClick={onClickCheckNetwork}
      />
    </>
  );
};

export default RequiredNetworkStep;
