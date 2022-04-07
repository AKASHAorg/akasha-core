import React from 'react';
import { Box, Text } from 'grommet';
import styled from 'styled-components';

import Icon from '../Icon';

interface IMobileHeadingProps {
  title: string;
  isDelisted: boolean;
  onClickArrowLeft: () => void;
}

const StyledWrapper = styled(Box)`
  display: none;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    display: flex;
  }
`;

const MobileHeading: React.FC<IMobileHeadingProps> = props => {
  const { title, isDelisted, onClickArrowLeft } = props;

  return (
    <StyledWrapper direction="row" margin={{ top: 'small', bottom: 'medium' }} align="start">
      <Icon type="arrowLeft" color="secondaryText" clickable={true} onClick={onClickArrowLeft} />
      <Box direction="row" align="center" margin="0 auto" pad={{ right: 'small' }}>
        <Box
          width="8px"
          height="8px"
          margin={{ right: 'small' }}
          round="50%"
          background={isDelisted ? 'red' : 'green'}
        />
        <Text weight={600} size="large" style={{ textTransform: 'capitalize' }}>
          {/* condition: title must always be three-word phrase for this component, pick the first two to show as heading on mobile */}
          {title.split(' ').slice(0, 2).join(' ')}
        </Text>
      </Box>
    </StyledWrapper>
  );
};

export default MobileHeading;
