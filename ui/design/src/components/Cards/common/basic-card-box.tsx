import { Box } from 'grommet';
import * as React from 'react';
import styled from 'styled-components';

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

export interface IBasicCardBox {
  className?: string;
  callToAction?: boolean;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({ children, className, callToAction }) => (
  <StyledBox
    direction="column"
    elevation="shadow"
    fill={true}
    pad="none"
    round="xsmall"
    border={
      callToAction
        ? {
            color: 'accent',
            size: 'xsmall',
            style: 'solid',
            side: 'all',
          }
        : {
            color: 'border',
            size: 'xsmall',
            style: 'solid',
            side: 'all',
          }
    }
    className={className}
  >
    {children}
  </StyledBox>
);

const MainAreaCardBox = styled(BasicCardBox)`
  max-width: 36.313rem;
`;

const WidgetAreaCardBox = styled(BasicCardBox)`
  width: 21rem;
`;

export { BasicCardBox, MainAreaCardBox, WidgetAreaCardBox };
