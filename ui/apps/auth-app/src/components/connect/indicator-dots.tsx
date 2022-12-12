import React from 'react';
import DS from '@akashaorg/design-system';

import { getDotColor } from '../../utils/connect';

const { Box, Icon, styled } = DS;

export interface IndicatorDotsProps {
  status: number;
  errorMessage: string;
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
  const { status, errorMessage } = props;

  const dotColor = getDotColor(status, errorMessage);

  return (
    <Box direction="row" gap="xsmall" align="center">
      <Dot background={dotColor} opacity={0.5} />

      <Dot size="1.25rem" background={dotColor}>
        {!errorMessage.length && status > 5 && <Icon type="checkSimple" size="xxs" color="white" />}
        {!!errorMessage.length && <Icon type="error" size="xxs" color="white" />}
      </Dot>

      <Dot background={dotColor} opacity={0.5} />
    </Box>
  );
};

export default IndicatorDots;
