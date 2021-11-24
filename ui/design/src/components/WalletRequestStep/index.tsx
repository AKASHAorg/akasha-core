import { Box, Text } from 'grommet';
import React from 'react';
import Icon from '../Icon';
import { StyledArrowIcon, StyledBox, StyledCheckmarkIcon, StyledIcon } from './styles';

export interface WalletRequestStepProps {
  heading: string;
  explanation: string;
  problem: string;
  resend: string;
  complete: string;
  textAgain: string;
  buttonLabel: string;
  walletRequest: () => Promise<unknown>;
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

  const renderIcon = () => {
    if (error) {
      return (
        <StyledIcon>
          <Icon type="error" size="md" color="red" />
        </StyledIcon>
      );
    }

    if (pending)
      return (
        <StyledIcon justify="center" align="center">
          <Icon type="loading" size="md" accentColor />
        </StyledIcon>
      );

    return (
      <StyledArrowIcon justify="center" align="center">
        <Icon type="arrowRight" />
      </StyledArrowIcon>
    );
  };

  if (completed) {
    return (
      <Box direction="row" align="center" pad="xsmall">
        <StyledCheckmarkIcon justify="center" align="center">
          <Icon type="checkSimple" color="green" size="xxs" />
        </StyledCheckmarkIcon>
        <Text margin={{ horizontal: '0.75rem' }} size="large">
          {complete} {ethAddress ? `(${ethAddress})` : ''}
        </Text>
      </Box>
    );
  }

  if (!pending && !completed) {
    return (
      <Box direction="row" align="center" pad="xsmall">
        <Icon type="circleDashed" />
        <Text color="gray" size="large" margin={{ horizontal: '0.75rem' }}>
          {heading}
        </Text>
      </Box>
    );
  }

  return (
    <Box direction="row" pad="xsmall">
      {renderIcon()}
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
            <Text color="accent" style={{ cursor: 'pointer' }} onClick={walletRequest}>
              {resend}
            </Text>
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default WalletRequestStep;
