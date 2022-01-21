import * as React from 'react';
import styled from 'styled-components';
import { Box, Text } from 'grommet';
import { EdgeSizeType } from 'grommet/utils';

import Icon from '../Icon';

export interface IStepIndicatorProps {
  activeIndex: number;
  stepLabels: string[];
  margin?: EdgeSizeType;
}

const StyledText = styled(Text)`
  line-height: 0;
`;

const StepIndicator: React.FC<IStepIndicatorProps> = props => {
  const { stepLabels, activeIndex, margin } = props;
  return (
    <Box
      direction="row"
      align="center"
      width={{ max: 'fit-content' }}
      margin={{ vertical: margin }}
    >
      {stepLabels.map((step, idx) => (
        <React.Fragment key={idx + step}>
          <Box
            height="1.5rem"
            width="1.5rem"
            round={true}
            justify="center"
            align="center"
            border={{
              color: idx <= activeIndex ? 'accentText' : 'secondaryText',
              size: 'xsmall',
            }}
            background={idx < activeIndex ? 'accentText' : 'none'}
          >
            {idx < activeIndex ? (
              <Icon type="checkSimple" size="xxs" color="white" />
            ) : (
              <StyledText color={idx === activeIndex ? 'accentText' : 'secondaryText'}>
                {idx + 1}
              </StyledText>
            )}
          </Box>
          {idx !== stepLabels.length - 1 && (
            <Box width="1rem" border={{ side: 'bottom', color: 'border', size: 'xsmall' }} />
          )}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default StepIndicator;
