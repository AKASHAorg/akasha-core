import { Box } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

export interface IBasicCardBox {
  className?: string;
  callToAction?: boolean;
  dashedBorder?: boolean;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({
  children,
  className,
  callToAction,
  dashedBorder,
  style,
  rootNodeRef,
}) => (
  <StyledBox
    style={style}
    direction="column"
    elevation="shadow"
    fill="horizontal"
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
        : dashedBorder
        ? { color: 'secondaryText', size: 'xsmall', style: 'dashed', side: 'all' }
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
    if (props.borderedShadow) {
      return css`
        border: 0.1rem solid ${props.theme.colors.darkerBorder};
        box-shadow: 2px 1px 11px 1px rgba(98, 107, 122, 0.25);
        -webkit-box-shadow: 2px 1px 11px 0px rgba(98, 107, 122, 0.25);
        -moz-box-shadow: 2px 1px 11px 0px rgba(98, 107, 122, 0.25);
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
