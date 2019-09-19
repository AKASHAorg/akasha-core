import React from 'react';
import styled, { css } from 'styled-components';
import { TopBarRightProps } from './TopBarRight';

export interface TopBarProps extends TopBarRightProps {
  fullEntry?: boolean;
  showSecondarySidebar?: boolean;
}

const TopBarWrapper = styled.div<Pick<TopBarProps, 'fullEntry' | 'showSecondarySidebar'>>`
  //position: fixed;
  right: 0;
  top: 0;
  height: 40px;
  transition: left 0.218s ease-in-out;
  background-color: ${props => props.theme.colors.background};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  font-size: ${props => props.theme.spacing.sizes.text.base};
  font-family: ${props => props.theme.shapes.fontFamily};
  color: ${props => props.theme.colors.dark};

  ${props => {
    const { showSecondarySidebar, fullEntry } = props;

    if (!fullEntry) {
      return css`
        left: 64px + 200px;
      `;
    }

    if (!showSecondarySidebar || fullEntry) {
      return css`
        left: 64px;
      `;
    }
  }};
  &_collapsed {
    left: @sidebar-width;
  }
  &__left-side {
    flex: 1 1 auto;
    height: 100%;
    margin-left: 20px;
  }
`;

const TopBar: React.FC<TopBarProps> = ({ fullEntry, showSecondarySidebar, ...props }) => {
  return (
    <TopBarWrapper fullEntry={fullEntry}>
      {/*<div className="top-bar__left-side" />*/}
      {/*<TopBarRight {...props} />*/}
    </TopBarWrapper>
  );
};

TopBar.defaultProps = {};

export default TopBar;
