import { Box } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

const StyledBox = styled(Box)<{ elevate?: string }>`
  background-color: ${props => props.theme.colors.background};
`;

export interface IBasicCardBox {
  className?: string;
  elevate?: string;
  callToAction?: boolean;
  dashedBorder?: boolean;
  darkBorder?: boolean;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  pad?: any;
  margin?: any;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({
  children,
  className,
  elevate,
  callToAction,
  dashedBorder,
  darkBorder,
  style,
  rootNodeRef,
  pad,
  margin,
}) => (
  <StyledBox
    style={style}
    direction="column"
    elevation="shadow"
    fill="horizontal"
    pad={pad || 'none'}
    margin={margin || 'none'}
    round="xsmall"
    elevate={elevate}
    border={
      callToAction
        ? {
            color: 'accent',
            size: 'xsmall',
            style: 'solid',
            side: 'all',
          }
        : dashedBorder
        ? { color: 'secondaryText', size: 'xsmall', style: 'dashed', side: 'all' }
        : darkBorder
        ? {
            color: 'darkBorder',
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
    ref={rootNodeRef}
  >
    {children}
  </StyledBox>
);

const MainAreaCardBox = styled(BasicCardBox)<{ verticalFill?: boolean; borderedShadow?: boolean }>`
  /* max-width: 36.313rem; */
  ${props => {
    if (props.verticalFill) {
      return css`
        height: 100%;
      `;
    }
    return;
  }}
`;

const WidgetAreaCardBox = styled(BasicCardBox)`
  width: 100%;
`;

const ModalCard = styled(BasicCardBox)`
  padding: 1em;
`;

export { BasicCardBox, MainAreaCardBox, WidgetAreaCardBox, ModalCard };
