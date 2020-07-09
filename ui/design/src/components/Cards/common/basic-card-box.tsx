import { Box } from 'grommet';
import * as React from 'react';
import styled, { css } from 'styled-components';

const StyledBox = styled(Box)`
  background-color: ${props => props.theme.colors.background};
`;

export interface IBasicCardBox {
  className?: string;
  callToAction?: boolean;
  style?: React.CSSProperties;
  rootNodeRef?: React.Ref<HTMLDivElement>;
}

const BasicCardBox: React.FC<IBasicCardBox> = ({
  children,
  className,
  callToAction,
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

const MainAreaCardBox = styled(BasicCardBox)<{ verticalFill?: boolean }>`
  max-width: 36.313rem;
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
  width: 21rem;
`;

const ModalCard = styled(BasicCardBox)`
  padding: 1em;
`;

export { BasicCardBox, MainAreaCardBox, WidgetAreaCardBox, ModalCard };
