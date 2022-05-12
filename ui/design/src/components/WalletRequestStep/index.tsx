import { Box, Text } from 'grommet';
import React from 'react';
import Icon from '../Icon';
import { AddressText, CircleDashed, StyledBox, StyledCheckmarkIcon } from './styles';
import { WalletRequestIcon } from './icon';

export interface WalletRequestStepProps {
  heading: string;
  explanation: string;
  problem: string;
  resend: string;
  complete: string;
  textAgain: string;
  buttonLabel: string;
  walletRequest: () => void;
  pending: boolean;
  completed: boolean;
  ethAddress?: string;
  error?: string;
}

const WalletRequestStep = (props: WalletRequestStepProps) => {
  const {
    heading,
    explanation,
    buttonLabel,
    walletRequest,
    complete,
    ethAddress,
    textAgain,
    resend,
    problem,
    pending,
    completed,
    error,
  } = props;

  if (completed) {
    return (
      <Box direction="row" align="center" pad={{ vertical: 'small', horizontal: 'xsmall' }}>
        <StyledCheckmarkIcon justify="center" align="center">
          <Icon type="checkSimple" color="green" size="xxs" />
        </StyledCheckmarkIcon>
        <AddressText margin={{ horizontal: '0.75rem' }} size="large">
          {complete} {ethAddress && <AddressText>{ethAddress}</AddressText>}
        </AddressText>
      </Box>
    );
  }

  if (!pending && !completed) {
    return (
      <Box direction="row" align="center" pad={{ vertical: 'small', horizontal: 'xsmall' }}>
        <CircleDashed />
        <Text color="gray" size="large" margin={{ horizontal: '0.75rem' }}>
          {heading}
        </Text>
      </Box>
    );
  }

  return (
    <Box direction="row" pad={{ vertical: 'small', horizontal: 'xsmall' }}>
      <WalletRequestIcon error={error} pending={pending} />
      <Box direction="column" pad={{ horizontal: 'small', vertical: 'xxsmall' }} fill>
        <Text margin={{ bottom: 'xsmall' }} weight="bold" size="large">
          {heading}
        </Text>
        <Text size="large">{explanation}</Text>
        {error && (
          <>
            <StyledBox
              onClick={walletRequest}
              justify="between"
              direction="row"
              margin={{ top: 'medium' }}
              error={error}
              fill
            >
              <Text size="large" color={error ? 'red' : 'accent'}>
                {error ? textAgain : buttonLabel}
              </Text>
              <Icon size="sm" type="arrowRight" color={error ? 'red' : 'accent'} />
            </StyledBox>
            <Text color="red" margin={{ top: 'xxsmall' }}>
              {error}
            </Text>
          </>
        )}
        {pending && !error && (
          <Text margin={{ top: 'medium', bottom: 'xxsmall' }}>
            <Text color="gray">{problem}</Text>{' '}
            <Text color="accentText" style={{ cursor: 'pointer' }} onClick={walletRequest}>
              {resend}
            </Text>
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default WalletRequestStep;
