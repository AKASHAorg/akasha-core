import { Box, Anchor } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

const StyledBox = styled(Box)<{ isSelected?: boolean }>`
  background-color: ${props =>
    props.isSelected ? props.theme.colors.activeCardBackground : props.theme.colors.background};
`;

export interface IBasicCardBox {
  className?: string;
  elevation?: string;
  callToAction?: boolean;
  dashedBorder?: boolean;
  darkBorder?: boolean;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  pad?: any;
  margin?: any;
  noBorder?: boolean;
  noBorderRadius?: boolean;
  isSelected?: boolean;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({
  children,
  className,
  elevation,
  callToAction,
  dashedBorder,
  darkBorder,
  style,
  rootNodeRef,
  pad,
  margin,
  noBorder,
  noBorderRadius,
  isSelected,
}) => (
  <StyledBox
    style={style}
    direction="column"
    elevation={elevation || 'shadow'}
    fill="horizontal"
    pad={pad || 'none'}
    margin={margin || 'none'}
    round={noBorderRadius ? false : 'xsmall'}
    isSelected={isSelected}
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
        : isSelected
        ? {
            color: 'accentText',
            size: 'xsmall',
            side: 'left',
          }
        : noBorder
        ? false
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

const StyledAnchor = styled(Anchor)`
  user-select: none;
  text-decoration: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  :hover {
    text-decoration: none;
  }
`;

export { BasicCardBox, MainAreaCardBox, WidgetAreaCardBox, ModalCard, StyledAnchor };
