import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

export interface IBasicCardBox {
  className?: string;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({ children, className, style, rootNodeRef }) => (
  <StyledBox
    style={style}
    direction="column"
    elevation="shadow"
    fill="horizontal"
    pad="none"
    round="xsmall"
    border={{
      color: 'border',
      size: 'xsmall',
      style: 'solid',
      side: 'all',
    }}
    className={className}
    ref={rootNodeRef}
  >
    {children}
  </StyledBox>
);

export default BasicCardBox;
