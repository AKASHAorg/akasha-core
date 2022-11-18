import * as React from 'react';
import Icon from '../Icon';
import styled from 'styled-components';

export type ScrollTopButtonProps = {
  onClick: () => void;
  className?: string;
};

const ScrollTopButton = React.forwardRef<HTMLDivElement, ScrollTopButtonProps>(
  ({ onClick, className }, ref) => {
    return (
      <Root ref={ref} className={className} onClick={() => onClick()}>
        <Icon type="arrowUp" clickable={true} accentColor={true} />
      </Root>
    );
  },
);

const Root = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 24px;
  background: ${props => props.theme.colors.scrollTopBackground};
  cursor: pointer;
  &: hover {
    background: ${props => props.theme.colors.scrollTopHoverBackground};
    & * {
      stroke: ${props => props.theme.colors.background};
    }
  }
`;

export default ScrollTopButton;
