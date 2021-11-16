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
  redDashedBorder?: boolean;
  darkBorder?: boolean;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
  pad?: any;
  margin?: any;
  noBorder?: boolean;
  noBorderRadius?: boolean;
  bottomBorderOnly?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({
  children,
  className,
  elevation,
  callToAction,
  dashedBorder,
  redDashedBorder,
  darkBorder,
  style,
  rootNodeRef,
  pad,
  margin,
  noBorder,
  noBorderRadius,
  bottomBorderOnly,
  isSelected,
  onClick,
}) => (
  <StyledBox
    style={style}
    direction="column"
    elevation={elevation || 'shadow'}
    background="background"
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
        ? {
            color: `${redDashedBorder ? 'errorText' : 'secondaryText'}`,
            size: 'xsmall',
            style: 'dashed',
            side: 'all',
          }
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
        : bottomBorderOnly
        ? { color: 'border', size: 'xsmall', style: 'solid', side: 'bottom' }
        : {
            color: 'border',
            size: 'xsmall',
            style: 'solid',
            side: 'all',
          }
    }
    className={className}
    ref={rootNodeRef}
    onClick={onClick}
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

const ModalCardLogin = styled(BasicCardBox)`
  padding: 1rem 5rem;
  position: relative;
  box-sizing: content-box;
  @media screen and (max-width: ${props => props.theme.breakpoints.medium.value}px) {
    padding: 1rem;
    box-sizing: border-box;
  }
`;

const StyledAnchor = styled(Anchor)`
  max-width: 100%;
  user-select: none;
  text-decoration: none;
  -ms-user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  :hover {
    text-decoration: none;
  }
`;

export {
  BasicCardBox,
  MainAreaCardBox,
  WidgetAreaCardBox,
  ModalCard,
  ModalCardLogin,
  StyledAnchor,
};
