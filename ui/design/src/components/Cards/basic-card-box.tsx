import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

export interface IBasicCardBox {
  className?: string;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({ children, className }) => (
  <StyledBox
    direction="column"
    elevation="shadow"
    fill={true}
    pad="none"
    round="xsmall"
    border={{
      color: 'border',
      size: 'xsmall',
      style: 'solid',
      side: 'all',
    }}
    className={className}
  >
    {children}
  </StyledBox>
);

export default BasicCardBox;
