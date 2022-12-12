import React from 'react';
import DS from '@akashaorg/design-system';

import { ErrorTypes } from '@akashaorg/ui-awf-hooks/lib/use-login';
import { getDotColor } from '../../utils/connect';

const { Box, Icon, styled } = DS;

export interface IndicatorDotsProps {
  status: number;
  error: ErrorTypes;
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
  const { status, error, errorMessage } = props;

  const dotColor = getDotColor(status, error, errorMessage);

  return (
    <Box direction="row" gap="xsmall" align="center">
      <Dot background={dotColor} opacity={0.5} />

      <Dot size="1.25rem" background={dotColor}>
        {status > 5 && <Icon type="checkSimple" size="xxs" color="white" />}
        {status === 0 && <Icon type="error" size="xxs" color="white" />}
      </Dot>

      <Dot background={dotColor} opacity={0.5} />
    </Box>
  );
};

export default IndicatorDots;
