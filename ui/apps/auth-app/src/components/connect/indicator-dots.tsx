import React from 'react';
import DS from '@akashaorg/design-system';
import { ConnectWalletStatus } from '.';
import { getDotColor } from '../../utils/connect';

const { Box, Icon, styled } = DS;

export interface IndicatorDotsProps {
  status: ConnectWalletStatus;
}

const Dot = styled(Box)<{ size?: string; color?: string; opacity?: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size ?? '1rem'};
  height: ${props => props.size ?? '1rem'};
  opacity: ${props => props.opacity ?? 1};
  border-radius: 100%;
`;

const IndicatorDots: React.FC<IndicatorDotsProps> = props => {
  const { status } = props;

  return (
    <Box direction="row" gap="xsmall" align="center">
      <Dot background={getDotColor(status)} opacity={0.5} />

      <Dot size="1.25rem" background={getDotColor(status)}>
        {status === ConnectWalletStatus.CONNECTED && (
          <Icon type="checkSimple" size="xxs" color="white" />
        )}
        {status === ConnectWalletStatus.ERROR && <Icon type="error" size="xxs" color="white" />}
      </Dot>

      <Dot background={getDotColor(status)} opacity={0.5} />
    </Box>
  );
};

export default IndicatorDots;
